import type { TablePluginView } from '@jotai-table';
import { DetailsViewOptions } from '@jotai-table/plugins/details/types';

import { DetailsPluginModel } from './model';
import { CollapseWrapper } from './ui/CollapseWrpapper';
import { DetailsTool } from './ui/DetailsTool';

export const DetailsToolSymbol = Symbol('details-tool');

export const DetailsPluginView = <Data,>({
  renderDetails,
  renderTool,
}: DetailsViewOptions<Data>): TablePluginView<
  Data,
  DetailsPluginModel<Data>
> => {
  return {
    renderRow: ({ node, model, row }) => {
      return (
        <CollapseWrapper renderDetails={renderDetails} row={row} model={model}>
          {node.props.children}
        </CollapseWrapper>
      );
    },
    renderTools: ({ model }) => {
      return {
        [DetailsToolSymbol]: () => (
          <DetailsTool model={model} renderTool={renderTool} />
        ),
      };
    },
  };
};
