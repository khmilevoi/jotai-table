import { useQueryAtom } from "jotai-async/react";
import { JotaiTable, JotaiTableModel } from "jotai-table";
import { DetailsPlugin } from "jotai-table/plugins/details";
import { SelectionPlugin } from "jotai-table/plugins/selection";

import {
  $activeUsers,
  $status,
  $users,
  getUsersEffect,
  type User,
} from "./model";

const tableModel = new JotaiTableModel<User>({
  columns: [
    SelectionPlugin.createColumn(),
    {
      id: "name",
      cell: ({ name }) => name,
      header: () => "Name",
    },
    {
      id: "email",
      cell: ({ email }) => email,
      header: () => "Email",
    },
  ],
  getRowId: (item) => item.email,
})
  .with(
    SelectionPlugin({
      $activeItems: $activeUsers,
      $status,
      getIsActive: ({ $isActive }) => $isActive,
    }),
  )
  .with(
    DetailsPlugin({
      renderDetails: ({ data }) => data.details,
    }),
  );

export const App = () => {
  useQueryAtom(getUsersEffect);

  return (
    <div style={{ width: "300px" }}>
      <JotaiTable model={tableModel} $data={$users} />
    </div>
  );
};
