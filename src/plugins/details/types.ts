import type { ReactNode } from 'react';

// export type DetailsModelOptions<Data> = {};

export type DetailsViewOptions<Data> = {
  renderTool: (props: {
    isCollapsed: boolean;
    collapse: () => void;
    uncollapse: () => void;
  }) => ReactNode;
  renderDetails: (props: { data: Data }) => ReactNode;
};
