import type { Atom, PrimitiveAtom } from "jotai/index";
import type { ReactElement, ReactNode } from "react";

export type TableApi<Data, Model extends PluginModel<Data>> = {
  initEffect: Atom<void>;
  $rows: Atom<Row<Data>[]>;
  $data: PrimitiveAtom<Data[]>;
  $dataMap: Atom<DataMap<Data>>;
  $columns: ColumnsAtom<Data>;
  plugins: Plugin<Data, Model>[];
};
export type Row<Data> = {
  id: string;
  $data: PrimitiveAtom<Data>;
};
export type Column<Data> =
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
export type ColumnsAtom<Data> = PrimitiveAtom<Column<Data>[]>;
export type Plugin<Data, Model extends PluginModel<Data>> = {
  model: Model;
  view: PluginView<Data, Model>;
};

export interface PluginModel<Data> {
  init(options: InitOptions<Data>): InitEffect;
}

export type InitEffect = Atom<void>;
export type DataMapAtom<Data> = Atom<DataMap<Data>>;
export type DataMap<Data> = Map<string, Atom<Data>>;
export type PluginView<Data, Model extends PluginModel<Data>> = {
  init(options: PluginApi<Data, Model>): InitEffect;

  renderCell?: (
    api: PluginApi<Data, Model> & {
      column: Column<Data>;
      row: Row<Data>;
      node: ReactElement;
    },
  ) => ReactElement;

  renderRow?: (
    api: PluginApi<Data, Model> & { row: Row<Data>; node: ReactElement },
  ) => ReactElement;

  renderTool?: (api: PluginApi<Data, Model>) => {
    left?: ReactElement;
    right?: ReactElement;
  };
};
export type PluginApi<
  Data,
  Model extends PluginModel<Data>,
> = InitOptions<Data> & { model: Model };
export type InitOptions<Data> = {
  $rows: Atom<Row<Data>[]>;
  $columns: ColumnsAtom<Data>;
  $dataMap: DataMapAtom<Data>;
};
