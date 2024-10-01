import type { PrimitiveAtom } from "jotai";

import type { TableColumn, TablePlugin } from "../../types.ts";
import { SelectionPluginModel, type SelectionStatusAtom } from "./model";
import { SelectionColumnSymbol, SelectionPluginView } from "./ui";

export const SelectionPlugin = <Data>({
  $activeItems,
  $status,
  getIsActive,
}: {
  getIsActive: (item: Data) => PrimitiveAtom<boolean>;
  $status: SelectionStatusAtom;
  $activeItems: PrimitiveAtom<Data[]>;
}): TablePlugin<Data, SelectionPluginModel<Data>> => {
  return {
    model: new SelectionPluginModel({ $activeItems, $status, getIsActive }),
    view: SelectionPluginView({ getIsActive }),
  };
};

SelectionPlugin.createColumn = <Data>(): TableColumn<Data> => {
  return {
    id: "selection",
    _libType: SelectionColumnSymbol,
  };
};

export type { SelectionStatus } from "./model.ts";
