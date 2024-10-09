# jotai-table

`jotai-table` is a table component for React based on Jotai. It allows easy integration of various plugins and state management through Jotai atoms.

## Installation

Install the dependencies:

```bash
npm install jotai-table jotai
```

or

```bash
yarn add jotai-table jotai
```

or

```bash
pnpm install jotai-table jotai
```

## Example Usage

```tsx
import { useAtomValue } from "jotai";
import { Table, TableModel } from "jotai-table";
import { DetailsPlugin } from "jotai-table/plugins/details";
import { SelectionPlugin, SelectionStatus } from "jotai-table/plugins/selection";

export type User = {
  name: string;
  email: string;
  details: string;
  $isActive: PrimitiveAtom<boolean>;
};

export const $users = atom<User[]>([
  {
    name: "John",
    email: "john@email.com",
    details: "John ".repeat(3),
  },
  {
    name: "Bob",
    email: "bob@email.com",
    details: "Bob ".repeat(3),
  },
]);

export const $status = atom<SelectionStatus>("inactive");
export const $activeUsers = atom<User[]>([]);

const tableModel = new TableModel<User>({
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
  return (
    <div style={{ width: "300px" }}>
      <Table model={tableModel} $data={$users} />
    </div>
  );
};
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
