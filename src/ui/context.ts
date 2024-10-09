import { atom } from 'jotai/index';
import { createContext, useContext } from 'react';

import type { TableApi, TablePluginModel, TableUserColumn } from '../types';

export type TableContextContract<Data> = TableApi<Data, TablePluginModel<Data>>;

export const TableContext = createContext<TableContextContract<unknown>>({
  $columns: atom<TableUserColumn<unknown>[]>([]),
  $data: atom<unknown[]>([]),
  $dataMap: atom(new Map()),
  $rows: atom([]),
  plugins: [],
  initEffect: atom(null),
  tools: {
    right: [],
    left: [],
  },
});

export const useJotaiTable = <Data>() =>
  useContext(TableContext) as TableContextContract<Data>;
