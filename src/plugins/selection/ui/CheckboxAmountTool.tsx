import { Flex } from '@chakra-ui/react';
import { RowsAtom } from '@jotai-table';
import { useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { ReactElement, useMemo } from 'react';

import { SelectionPluginModel } from '../model';

type CheckboxToolProps<Data> = {
  model: SelectionPluginModel<Data>;
  renderAmount: (
    activeItemsAmount: number,
    itemsAmount: number,
  ) => ReactElement;
  $rows: RowsAtom<Data>;
};

export const CheckboxAmountTool = <Data,>({
  model,
  renderAmount,
  $rows,
}: CheckboxToolProps<Data>) => {
  const dataLength = useAtomValue(
    useMemo(() => {
      return selectAtom($rows, (rows) => rows.length);
    }, [$rows]),
  );

  const activeItems = useAtomValue(model.getActiveItems());

  return <Flex>{renderAmount(activeItems.length, dataLength)}</Flex>;
};
