import type {
  TablePlugin,
  TablePluginColumn,
  TablePluginTool,
} from '@jotai-table';

import { SelectionPluginModel } from './model';
import { SelectionModelOptions, SelectionViewOptions } from './types';
import {
  SelectionActionsTool,
  SelectionAmountTool,
  SelectionColumnSymbol,
  SelectionPluginView,
} from './View';

export const SelectionPlugin = <Data>({
  view,
  model,
}: {
  model: SelectionModelOptions<Data>;
  view: SelectionViewOptions<Data>;
}): TablePlugin<Data, SelectionPluginModel<Data>> => {
  return {
    model: (initOptions) => new SelectionPluginModel(model, initOptions),
    view: SelectionPluginView(view),
  };
};

SelectionPlugin.createColumn = (id: string): TablePluginColumn => {
  return {
    id,
    _libType: SelectionColumnSymbol,
  };
};

SelectionPlugin.createActionsTool = (id: string): TablePluginTool => ({
  id,
  _libId: SelectionActionsTool,
});

SelectionPlugin.createAmountTool = (id: string): TablePluginTool => ({
  id,
  _libId: SelectionAmountTool,
});
