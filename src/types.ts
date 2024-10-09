import type { Atom, PrimitiveAtom } from 'jotai';
import type { FunctionComponent, ReactElement, ReactNode } from 'react';

export type TableApi<Data, Model extends TablePluginModel<Data>> = {
  initEffect: Atom<void>;
  $rows: RowsAtom<Data>;
  $data: Atom<Data[]>;
  $dataMap: Atom<TableDataMap<Data>>;
  $columns: ColumnsAtom<Data>;
  plugins: {
    model: Model;
    view: TablePluginView<Data, Model>;
  }[];
  tools: TableTools<Data>;
};

export type TableTools<Data> = {
  left: TablePluginToolsList<Data>;
  right: TablePluginToolsList<Data>;
};

export type TablePluginToolsList<Data> = (
  | TablePluginTool
  | JotaiTableTool<Data>
)[];

export type TablePluginView<Data, Model extends TablePluginModel<Data>> = {
  init?: (options: TablePluginApi<Data, Model>) => TableInitEffect;

  initColumns?: (api: TablePluginApi<Data, Model>) => {
    [ColumnId: symbol]: TableUserColumn<Data>;
  };

  renderCell?: (
    api: TablePluginViewApi<Data, Model> & {
      column: JotaiTableColumn<Data>;
      row: JotaiTableRow<Data>;
      node: ReactElement;
    },
  ) => ReactElement;

  renderRow?: (
    api: TablePluginViewApi<Data, Model> & {
      row: JotaiTableRow<Data>;
      node: ReactElement;
    },
  ) => ReactElement;

  renderTools?: (api: TablePluginViewApi<Data, Model>) => {
    [ToolId: symbol]: FunctionComponent;
  };
};

export type TablePluginApi<
  Data,
  Model extends TablePluginModel<Data>,
> = TableInitOptions<Data> & { model: Model };

export type TableInitOptions<Data> = {
  $rows: RowsAtom<Data>;
  $dataMap: TableDataMapAtom<Data>;
};

export type TablePlugin<Data, Model extends TablePluginModel<Data>> = {
  model: (initOptions: TableInitOptions<Data>) => Model;
  view: TablePluginView<Data, Model>;
};

export type TablePluginViewApi<
  Data,
  Model extends TablePluginModel<Data>,
> = TablePluginApi<Data, Model> & {
  $columns: ColumnsAtom<Data>;
};

export abstract class TablePluginModel<Data> {
  protected readonly $dataMap: TableDataMapAtom<Data>;
  protected readonly $rows: RowsAtom<Data>;

  protected constructor({ $dataMap, $rows }: TableInitOptions<Data>) {
    this.$dataMap = $dataMap;
    this.$rows = $rows;
  }

  abstract init(): TableInitEffect;
}

export type JotaiTableTool<Data> = FunctionComponent<
  Omit<TablePluginViewApi<Data, never>, 'model'>
>;

export type TableInitEffect = Atom<void>;

export type ColumnsAtom<Data> = PrimitiveAtom<TableUserColumn<Data>[]>;

export type RowsAtom<Data> = Atom<JotaiTableRow<Data>[]>;

export type TableDataMapAtom<Data> = Atom<TableDataMap<Data>>;

export type TableDataMap<Data> = Map<string, Data>;

export type JotaiTableRow<Data> = {
  id: string;
  data: Data;
};

export type JotaiTableColumn<Data> = TableUserColumn<Data> | TablePluginColumn;

export type TableUserColumn<Data> = {
  id: string;
  header: () => ReactNode;
  cell: (data: Data, id: string) => ReactNode;
  _libType?: never;
};

export type TablePluginColumn = {
  id: string;
  _libType: symbol;
};

export type TablePluginTool = {
  id: string;
  _libId: symbol;
};
