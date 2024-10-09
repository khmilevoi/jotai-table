import { Flex } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';
import * as React from 'react';
import { useMemo } from 'react';

import { DetailsPluginModel } from '../model';
import { DetailsViewOptions } from '../types';

type DetailsToolProps<Data> = {
  model: DetailsPluginModel<Data>;
  renderTool: DetailsViewOptions<Data>['renderTool'];
};

export const DetailsTool = <Data,>({
  model,
  renderTool,
}: DetailsToolProps<Data>) => {
  const isCollapsed = useAtomValue(model.getIsAllCollapsed());

  const collapse = useSetAtom(model.collapse());
  const uncollapse = useSetAtom(model.uncollapse());

  const tool = useMemo(() => {
    return renderTool({
      isCollapsed,
      collapse,
      uncollapse,
    });
  }, [renderTool, isCollapsed, collapse, uncollapse]);

  return <Flex>{tool}</Flex>;
};
