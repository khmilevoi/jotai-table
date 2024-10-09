import { TablePluginView } from '../../types';
import { SelectionPluginModel } from './model';
import { SelectionViewOptions } from './types';
import { CheckboxActionsTool } from './ui/CheckboxActionsTool';
import { CheckboxAmountTool } from './ui/CheckboxAmountTool';
import { CheckboxCell } from './ui/CheckboxCell';
import { CheckboxHeader } from './ui/CheckboxHeader';

export const SelectionColumnSymbol = Symbol('selection-column');
export const SelectionAmountTool = Symbol('selection-amount-tool');
export const SelectionActionsTool = Symbol('selection-actions-tool');

export const SelectionPluginView = <Data,>({
  renderAmount,
  renderActions,
}: SelectionViewOptions<Data>): TablePluginView<
  Data,
  SelectionPluginModel<Data>
> => ({
  initColumns: ({ model }) => {
    return {
      [SelectionColumnSymbol]: {
        id: 'isActive',
        header: () => {
          return <CheckboxHeader model={model} />;
        },
        cell: (data) => {
          return <CheckboxCell $isActive={model.getIsActive(data)} />;
        },
      },
    };
  },
  renderTools: ({ model, $rows }) => {
    return {
      [SelectionAmountTool]: () => (
        <CheckboxAmountTool
          model={model}
          renderAmount={renderAmount}
          $rows={$rows}
        />
      ),
      [SelectionActionsTool]: () =>
        renderActions && (
          <CheckboxActionsTool model={model} actions={renderActions(model)} />
        ),
    };
  },
});
