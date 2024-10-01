import { type Atom, atom, type PrimitiveAtom } from "jotai";
import { atomEffect } from "jotai-effect";

import type {
  TableApi,
  TableColumn,
  TableDataMap,
  TablePlugin,
  TablePluginModel,
  TableRow,
} from "./types.ts";

export class TableModel<Data> {
  private readonly plugins: TablePlugin<Data, TablePluginModel<Data>>[] = [];

  constructor(
    private readonly options: {
      columns: TableColumn<Data>[];
      getRowId: (item: Data) => string;
    },
  ) {}

  private createRows($data: PrimitiveAtom<Data[]>): Atom<TableRow<Data>[]> {
    return atom((get) =>
      get($data).map((item) => ({
        id: this.options.getRowId(item),
        $data: atom(item),
      })),
    );
  }

  private createDataMap($rows: Atom<TableRow<Data>[]>) {
    return atom((get) => {
      return get($rows).reduce<TableDataMap<Data>>((map, row) => {
        map.set(row.id, row.$data);

        return map;
      }, new Map());
    });
  }

  private readonly $data = atom<Data[]>([]);
  private api: TableApi<Data, TablePluginModel<Data>> | null = null;

  private isInited = false;

  init() {
    if (this.api) {
      return this.api;
    }

    const $rows = this.createRows(this.$data);
    const $dataMap = this.createDataMap($rows);
    const $columns = atom(this.options.columns);

    const initEffect = atomEffect((get) => {
      if (this.isInited) {
        return;
      }

      this.plugins.forEach((plugin) => {
        get(
          plugin.model.init({
            $dataMap,
            $rows,
            $columns,
          }),
        );
        get(
          plugin.view.init({
            $dataMap,
            $rows,
            $columns,
            model: plugin.model,
          }),
        );
      });

      this.isInited = true;
    });

    this.api = {
      initEffect,
      $rows,
      $dataMap,
      $columns,
      $data: this.$data,
      plugins: this.plugins,
    };

    return this.api;
  }

  getColumns() {
    return this.options.columns;
  }

  getPlugins() {
    return this.plugins;
  }

  with(plugin: TablePlugin<Data, TablePluginModel<Data>>) {
    this.plugins.push(plugin);

    return this;
  }
}
