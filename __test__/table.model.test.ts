import { atomEffect } from "jotai-effect";
import type { TableColumn, TablePlugin, TablePluginModel } from "jotai-table";
import { TableModel } from "jotai-table";
import { beforeEach, describe, expect, it } from "vitest";

interface TestData {
  id: string;
  name: string;
}

describe("TableModel", () => {
  let tableModel: TableModel<TestData>;
  const columns: TableColumn<TestData>[] = [
    {
      id: "id",
      header: () => "ID",
      cell: (data) => data.id,
    },
    {
      id: "name",
      header: () => "Name",
      cell: (data) => data.name,
    },
  ];

  beforeEach(() => {
    tableModel = new TableModel<TestData>({
      columns,
      getRowId: (item) => item.id,
    });
  });

  it("should initialize correctly", () => {
    const api = tableModel.init();
    expect(api).toBeDefined();
    expect(api.$rows).toBeDefined();
    expect(api.$dataMap).toBeDefined();
    expect(api.$columns).toBeDefined();
    expect(api.plugins).toEqual([]);
  });

  it("should return columns", () => {
    expect(tableModel.getColumns()).toEqual(columns);
  });

  it("should add plugins", () => {
    const plugin: TablePlugin<TestData, TablePluginModel<TestData>> = {
      model: {
        init: () => atomEffect(() => {}),
      },
      view: {
        init: () => atomEffect(() => {}),
      },
    };
    tableModel.with(plugin);
    expect(tableModel.getPlugins()).toContain(plugin);
  });
});
