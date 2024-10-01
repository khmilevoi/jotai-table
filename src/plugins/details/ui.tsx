import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { atomEffect } from "jotai-effect";
import type { TablePluginView } from "jotai-table";
import { cloneElement, type ReactNode } from "react";

import { DetailsPluginModel } from "./model";

export const DetailsPluginView = <Data,>({
  renderDetails,
}: {
  renderDetails: (props: { data: Data }) => ReactNode;
}): TablePluginView<Data, DetailsPluginModel<Data>> => {
  return {
    init: () => {
      return atomEffect(() => {});
    },
    renderRow: ({ node, model, row, $columns }) => {
      const Row = () => {
        const isCollapsed = useAtomValue(model.getStatus(row.id));

        const data = useAtomValue(row.$data);
        const columns = useAtomValue($columns);

        const Cell = () => {
          const [isCollapsed, setIsCollapsed] = useAtom(
            model.getStatus(row.id),
          );

          return (
            <td>
              <button
                style={{ transform: "rotateZ(-90deg)", padding: "0" }}
                onClick={() => {
                  setIsCollapsed(!isCollapsed);
                }}
              >
                {isCollapsed ? "<" : ">"}
              </button>
            </td>
          );
        };

        return (
          <>
            {cloneElement(
              node,
              {
                ...node.props,
                key: node.key,
              },
              [node.props.children, <Cell key={`${row.id}-details-button`} />],
            )}
            {!isCollapsed && (
              <tr key={`${row.id}-details`}>
                <td colSpan={columns.length}>
                  <div style={{ height: "100%" }}>
                    {renderDetails({ data })}
                  </div>
                </td>
              </tr>
            )}
          </>
        );
      };

      return <Row />;
    },
    renderTool: ({ model }) => {
      const Tool = () => {
        const isAllCollapsed = useAtomValue(model.getIsAllCollapsed());
        const collapse = useSetAtom(model.collapse());
        const show = useSetAtom(model.show());

        return (
          <div>
            <button
              onClick={() => {
                if (isAllCollapsed) {
                  show();
                } else {
                  collapse();
                }
              }}
            >
              {isAllCollapsed ? "View" : "Hide"} all
            </button>
          </div>
        );
      };

      return {
        right: <Tool />,
      };
    },
  };
};
