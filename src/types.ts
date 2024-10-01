import type { Atom, PrimitiveAtom } from "jotai/index";
import type { ReactElement, ReactNode } from "react";

export type TableApi<Data, Model extends TablePluginModel<Data>> = {
  initEffect: Atom<void>;
  $rows: Atom<TableRow<Data>[]>;
  $data: PrimitiveAtom<Data[]>;
  $dataMap: Atom<TableDataMap<Data>>;
  $columns: ColumnsAtom<Data>;
  plugins: TablePlugin<Data, Model>[];
};
export type TableRow<Data> = {
  id: string;
  $data: PrimitiveAtom<Data>;
};
export type TableColumn<Data> =
  | {
      id: string;
      header: () => ReactNode;
      cell: (data: Data, id: string) => ReactNode;
      _libType?: never;
    }
  | {
      id: string;
      _libType: symbol;
    };
export type ColumnsAtom<Data> = PrimitiveAtom<TableColumn<Data>[]>;
export type TablePlugin<Data, Model extends TablePluginModel<Data>> = {
  model: Model;
  view: TablePluginView<Data, Model>;
};

export interface TablePluginModel<Data> {
  init(options: TableInitOptions<Data>): TableInitEffect;
}

export type TableInitEffect = Atom<void>;
export type TableDataMapAtom<Data> = Atom<TableDataMap<Data>>;
export type TableDataMap<Data> = Map<string, Atom<Data>>;
export type TablePluginView<Data, Model extends TablePluginModel<Data>> = {
  init(options: TablePluginApi<Data, Model>): TableInitEffect;

  renderCell?: (
    api: TablePluginApi<Data, Model> & {
      column: TableColumn<Data>;
      row: TableRow<Data>;
      node: ReactElement;
    },
  ) => ReactElement;

  renderRow?: (
    api: TablePluginApi<Data, Model> & {
      row: TableRow<Data>;
      node: ReactElement;
    },
  ) => ReactElement;

  renderTool?: (api: TablePluginApi<Data, Model>) => {
    left?: ReactElement;
    right?: ReactElement;
  };
};
export type TablePluginApi<
  Data,
  Model extends TablePluginModel<Data>,
> = TableInitOptions<Data> & { model: Model };
export type TableInitOptions<Data> = {
  $rows: Atom<TableRow<Data>[]>;
  $columns: ColumnsAtom<Data>;
  $dataMap: TableDataMapAtom<Data>;
};
