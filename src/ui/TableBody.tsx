import { Tbody } from '@chakra-ui/react';
import { useAtomValue } from 'jotai/react';
import { memo } from 'react';

import { useJotaiTable } from './context';
import { TableRow } from './TableRow';

export const TableBody = memo(<Data,>() => {
  const { $columns, $rows } = useJotaiTable<Data>();

  const columns = useAtomValue($columns);
  const rows = useAtomValue($rows);

  return (
    <Tbody>
      {rows.map((row) => {
        return <TableRow key={row.id} row={row} columns={columns} />;
      })}
    </Tbody>
  );
});
TableBody.displayName = 'TableBody';
