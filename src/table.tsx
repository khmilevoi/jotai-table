import { atom } from "jotai";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import type { PluginModel, TableApi } from "jotai-table";
import {
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { TableModel } from "./table.model";
import type { Column, Row } from "./types.ts";

export type TableProps<Data> = {
  model: TableModel<Data>;
  data: Data[];
};

export const Table = <Data,>({ model, data: source }: TableProps<Data>) => {
  const { $rows, initEffect, $columns, $data, plugins, $dataMap } =
    useMemo(() => {
      return model.init();
    }, [model]);

  const setData = useSetAtom($data);

  useEffect(() => {
    setData(source);
  }, [source]);

  useAtom(initEffect);

  const contextValue = useMemo(() => {
    return {
      $rows,
      initEffect,
      $columns,
      $data,
      plugins,
      $dataMap,
    } as TableContextContract<unknown>;
  }, [$rows, initEffect, $columns, $data, plugins, $dataMap]);

  return (
    <TableContext.Provider value={contextValue}>
      <div>
        <Tools />
        <table>
          <Thead />
          <Tbody />
        </table>
      </div>
    </TableContext.Provider>
  );
};

type TableContextContract<Data> = TableApi<Data, PluginModel<Data>>;

const TableContext = createContext<TableContextContract<unknown>>({
  $columns: atom<Column<unknown>[]>([]),
  $data: atom<unknown[]>([]),
  $dataMap: atom(new Map()),
  $rows: atom([]),
  plugins: [],
  initEffect: atom(null),
});

const useTable = <Data,>() =>
  useContext(TableContext) as TableContextContract<Data>;

const Tools = <Data,>() => {
  const { $columns, $dataMap, $rows, plugins } = useTable<Data>();

  const { left, right } = useMemo(() => {
    return plugins.reduce<{ left: ReactNode[]; right: ReactNode[] }>(
      (result, plugin) => {
        if (plugin.view.renderTool) {
          const tool = plugin.view.renderTool({
            $columns,
            $dataMap,
            $rows,
            model: plugin.model,
          });

          if (tool.left) {
            result.left.push(tool.left);
          }

          if (tool.right) {
            result.right.push(tool.right);
          }
        }

        return result;
      },
      { left: [], right: [] },
    );
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex" }}>{left}</div>

      <div style={{ display: "flex" }}>{right}</div>
    </div>
  );
};

const Thead = <Data,>() => {
  const { $columns } = useTable<Data>();
  const columns = useAtomValue($columns);

  return (
    <thead>
      <tr>
        {columns.map((column) => {
          return <Th key={column.id} column={column} />;
        })}
      </tr>
    </thead>
  );
};

const Th = <Data,>({ column }: { column: Column<Data> }) => {
  if (column._libType) {
    return null;
  }

  return <th>{column.header()}</th>;
};

const Tbody = <Data,>() => {
  const { $columns, $rows } = useTable<Data>();

  const columns = useAtomValue($columns);
  const rows = useAtomValue($rows);

  return (
    <tbody>
      {rows.map((row) => {
        return <Tr key={row.id} row={row} columns={columns} />;
      })}
    </tbody>
  );
};

const Tr = <Data,>({
  columns,
  row,
}: {
  row: Row<Data>;
  columns: Column<Data>[];
}) => {
  const { $columns, $dataMap, $rows, plugins } = useTable<Data>();

  const originalRow = (
    <tr>
      {columns.map((column) => (
        <Td row={row} column={column} key={`${row.id}.${column.id}`} />
      ))}
    </tr>
  );

  const rowNode = useMemo(() => {
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
  }, []);

  return rowNode;
};

const Td = <Data,>({
  row,
  column,
}: {
  row: Row<Data>;
  column: Column<Data>;
}) => {
  const { $columns, $dataMap, $rows, plugins } = useTable<Data>();

  const data = useAtomValue(row.$data);

  if (column._libType) {
    return null;
  }

  const originalCell = <td>{column.cell(data, row.id)}</td>;

  const cellNode = useMemo(() => {
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
  }, []);

  return cellNode;
};
