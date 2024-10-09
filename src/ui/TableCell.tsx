import { Td } from '@chakra-ui/react';
import type { JotaiTableRow, TableUserColumn } from '@jotai-table';
import { memo, type ReactElement, useMemo } from 'react';

import { useJotaiTable } from './context';

export const TableCell = memo(
  <Data,>({
    row,
    column,
  }: {
    row: JotaiTableRow<Data>;
    column: TableUserColumn<Data>;
  }) => {
    const { $columns, $dataMap, $rows, plugins } = useJotaiTable<Data>();

    return useMemo(() => {
      const originalCell = <Td>{column.cell(row.data, row.id)}</Td>;

      return plugins.reduce<ReactElement>(
        (result, plugin) =>
          plugin.view.renderCell?.({
            node: result,
            $columns,
            $dataMap,
            $rows,
            column,
            row,
            model: plugin.model,
          }) ?? result,
        originalCell,
      );
    }, [$columns, $dataMap, $rows, column, plugins, row]);
  },
);
TableCell.displayName = 'TableCell';
