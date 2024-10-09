import type { PrimitiveAtom, WritableAtom } from 'jotai/index';
import { ReactElement } from 'react';

import { SelectionPluginModel } from './model';

export type SelectionModelOptions<Data> = {
  getIsActive: (item: Data) => PrimitiveAtom<boolean>;
  $status: SelectionStatusAtom;
  $activeItems: PrimitiveAtom<Data[]>;
};

export type SelectionViewOptions<Data> = {
  renderAmount: (
    activeItemsAmount: number,
    itemsAmount: number,
  ) => ReactElement;
  renderActions?: (model: SelectionPluginModel<Data>) => SelectionAction[];
};

export type SelectionStatusAtom = WritableAtom<
  SelectionStatus,
  [SelectionStatus],
  void
>;

export type SelectionStatus = 'inactive' | 'active' | 'partial';

export type SelectionAction = {
  id: string;
  label: string;
  action: () => void;
};
