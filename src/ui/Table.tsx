import { Flex } from '@chakra-ui/react';
import { Atom } from 'jotai';
import { useAtom } from 'jotai/react';
import { memo, useMemo } from 'react';

import { JotaiTableModel } from '../model/table.model';
import { TableContext, TableContextContract } from './context';
import { StyledTable } from './styles';
import { TableBody } from './TableBody';
import { TableHead } from './TableHead';
import { Tools } from './Tools';

export type JotaiTableProps<Data> = {
  model: JotaiTableModel<Data>;
  $data: Atom<Data[]>;
};

export const JotaiTable = memo(
  <Data,>({ model, $data }: JotaiTableProps<Data>) => {
    const tableApi = useMemo(() => model.init($data), [model, $data]);

    useAtom(tableApi.initEffect);

    return (
      <TableContext.Provider value={tableApi as TableContextContract<unknown>}>
        <Flex flexDirection={'column'} gap={2}>
          <Tools />
          <StyledTable>
            <TableHead />
            <TableBody />
          </StyledTable>
        </Flex>
      </TableContext.Provider>
    );
  },
);

JotaiTable.displayName = 'JotaiTable';
