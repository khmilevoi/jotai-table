import { Thead, Tr } from '@chakra-ui/react';
import { useAtomValue } from 'jotai/react';
import { memo } from 'react';

import { useJotaiTable } from './context';
import { TableHeader } from './TableHeader';

export const TableHead = memo(<Data,>() => {
  const { $columns } = useJotaiTable<Data>();
  const columns = useAtomValue($columns);

  return (
    <Thead>
      <Tr>
        {columns.map((column) => {
          return <TableHeader key={column.id} column={column} />;
        })}
      </Tr>
    </Thead>
  );
});
TableHead.displayName = 'TableHead';
