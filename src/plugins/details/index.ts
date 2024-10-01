import type { TablePlugin } from "jotai-table";
import type { ReactNode } from "react";

import { DetailsPluginModel } from "./model";
import { DetailsPluginView } from "./ui";

export const DetailsPlugin = <Data>({
  renderDetails,
}: {
  renderDetails: (props: { data: Data }) => ReactNode;
}): TablePlugin<Data, DetailsPluginModel<Data>> => {
  return {
    model: new DetailsPluginModel(),
    view: DetailsPluginView({ renderDetails }),
  };
};
