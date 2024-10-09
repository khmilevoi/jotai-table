import type { TablePlugin, TablePluginTool } from '@jotai-table';

import { DetailsPluginModel } from './model';
import { DetailsViewOptions } from './types';
import { DetailsPluginView, DetailsToolSymbol } from './View';

export const DetailsPlugin = <Data>({
  view,
}: {
  view: DetailsViewOptions<Data>;
}): TablePlugin<Data, DetailsPluginModel<Data>> => {
  return {
    model: (initOptions) => new DetailsPluginModel(initOptions),
    view: DetailsPluginView(view),
  };
};

DetailsPlugin.createDetailsTool = (id: string): TablePluginTool => ({
  id,
  _libId: DetailsToolSymbol,
});
