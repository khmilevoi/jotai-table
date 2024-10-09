import { Th } from '@chakra-ui/react';
import type { JotaiTableColumn } from '@jotai-table';
import { memo } from 'react';

export const TableHeader = memo(
  <Data,>({ column }: { column: JotaiTableColumn<Data> }) => {
    if (column._libType) {
      return null;
    }

    return <Th>{column.header()}</Th>;
  },
);
TableHeader.displayName = 'TableHeader';
