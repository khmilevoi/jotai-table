import { Tr } from '@chakra-ui/react';
import { JotaiTableRow, TableUserColumn } from '@jotai-table';
import { memo, type ReactElement, useMemo } from 'react';

import { useJotaiTable } from './context';
import { TableCell } from './TableCell';

export const TableRow = memo(
  <Data,>({
    columns,
    row,
  }: {
    row: JotaiTableRow<Data>;
    columns: TableUserColumn<Data>[];
  }) => {
    const { $columns, $dataMap, $rows, plugins } = useJotaiTable<Data>();

    return useMemo(() => {
      const originalRow = (
        <Tr>
          {columns.map((column) => (
            <TableCell
              row={row}
              column={column}
              key={`${row.id}.${column.id}`}
            />
          ))}
        </Tr>
      );

      return plugins.reduce<ReactElement>(
        (result, plugin) =>
          plugin.view.renderRow?.({
            node: result,
            $columns,
            $dataMap,
            $rows,
            row,
            model: plugin.model,
          }) ?? result,
        originalRow,
      );
    }, [$columns, $dataMap, $rows, columns, plugins, row]);
  },
);
TableRow.displayName = 'TableRow';
