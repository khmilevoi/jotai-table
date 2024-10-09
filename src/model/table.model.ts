import { type Atom, atom } from 'jotai';
import { atomEffect } from 'jotai-effect';

import {
  JotaiTableColumn,
  JotaiTableRow,
  TableApi,
  TableDataMap,
  TablePlugin,
  TablePluginModel,
  TableTools,
  TableUserColumn,
} from '../types';

export class JotaiTableModel<Data> {
  private readonly plugins: TablePlugin<Data, TablePluginModel<Data>>[] = [];

  constructor(
    private readonly options: {
      columns: JotaiTableColumn<Data>[];
      getRowId: (item: Data) => string;
      tools?: TableTools<Data>;
    },
  ) {}

  private createRows($data: Atom<Data[]>): Atom<JotaiTableRow<Data>[]> {
    return atom((get) =>
      get($data).map((item) => ({
        id: this.options.getRowId(item),
        data: item,
      })),
    );
  }

  private createDataMap($rows: Atom<JotaiTableRow<Data>[]>) {
    return atom((get) => {
      return get($rows).reduce<TableDataMap<Data>>((map, row) => {
        map.set(row.id, row.data);

        return map;
      }, new Map());
    });
  }

  private $data: Atom<Data[]> | null = null;

  private isInited = false;

  private api: TableApi<Data, TablePluginModel<Data>> | null = null;

  init($data: Atom<Data[]>): TableApi<Data, TablePluginModel<Data>> {
    if (this.api) {
      return this.api;
    }

    this.$data = $data;

    const $rows = this.createRows($data);
    const $dataMap = this.createDataMap($rows);

    const plugins = this.plugins.map((plugin) => ({
      model: plugin.model({ $rows, $dataMap }),
      view: plugin.view,
    }));

    const pluginColumns = plugins.reduce<Map<symbol, TableUserColumn<Data>>>(
      (result, plugin) => {
        if (plugin.view.initColumns) {
          const columns = plugin.view.initColumns({
            model: plugin.model,
            $dataMap,
            $rows,
          });

          Object.getOwnPropertySymbols(columns).forEach((key) => {
            const column = columns[key];
            result.set(key, column);
          });
        }

        return result;
      },
      new Map(),
    );

    const $columns = atom(
      this.options.columns.reduce<TableUserColumn<Data>[]>((result, column) => {
        if (column._libType) {
          const pluginColumn = pluginColumns.get(column._libType);

          if (pluginColumn) {
            result.push(pluginColumn);
          }
        } else {
          result.push(column);
        }

        return result;
      }, []),
    );

    const initEffect = atomEffect((get) => {
      if (this.isInited) {
        return;
      }

      plugins.forEach((plugin) => {
        get(plugin.model.init());
        if (plugin.view.init) {
          get(
            plugin.view.init({
              $dataMap,
              $rows,
              model: plugin.model,
            }),
          );
        }
      });

      this.isInited = true;
    });

    this.api = {
      initEffect,
      $rows,
      $dataMap,
      $columns,
      $data: this.$data,
      plugins,
      tools: this.options.tools ?? {
        left: [],
        right: [],
      },
    };

    return this.api;
  }

  getColumns() {
    return this.options.columns;
  }

  getPlugins() {
    return this.plugins;
  }

  with<Model extends TablePluginModel<Data>>(plugin: TablePlugin<Data, Model>) {
    this.plugins.push(
      plugin as unknown as TablePlugin<Data, TablePluginModel<Data>>,
    );

    return this;
  }
}
