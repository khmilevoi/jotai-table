import { Flex } from '@chakra-ui/react';
import { TablePluginToolsList } from '@jotai-table';
import { useJotaiTable } from '@jotai-table/ui/context';
import { FunctionComponent, memo, useMemo } from 'react';

export const Tools = memo(<Data,>() => {
  const { tools } = useJotaiTable<Data>();

  const toolsMap = useToolsMap();

  const left = useTools(tools.left, toolsMap);
  const right = useTools(tools.right, toolsMap);

  return (
    <Flex justifyContent={'space-between'} alignContent={'stretch'}>
      <Flex alignItems={'center'} gap={'5px'}>
        {left}
      </Flex>

      <Flex alignItems={'center'} gap={'5px'}>
        {right}
      </Flex>
    </Flex>
  );
});
Tools.displayName = 'Tools';

const useToolsMap = <Data,>() => {
  const { $columns, $dataMap, $rows, plugins } = useJotaiTable<Data>();

  return useMemo<Map<symbol, FunctionComponent>>(() => {
    return plugins.reduce((result, plugin) => {
      const tools = plugin.view.renderTools?.({
        model: plugin.model,
        $rows,
        $dataMap,
        $columns,
      });

      if (tools === undefined) {
        return result;
      }

      Object.getOwnPropertySymbols(tools).forEach((key) => {
        const tool = tools[key];

        result.set(key, tool);
      });

      return result;
    }, new Map());
  }, [plugins, $rows, $dataMap, $columns]);
};

const useTools = <Data,>(
  tools: TablePluginToolsList<Data>,
  toolsMap: Map<symbol, FunctionComponent>,
) => {
  const { $columns, $dataMap, $rows } = useJotaiTable<Data>();

  return useMemo(() => {
    return tools.map((Tool, index) => {
      if ('_libId' in Tool) {
        const Component = toolsMap.get(Tool._libId);

        if (Component === undefined) {
          return null;
        }

        return <Component key={Tool.id} />;
      }

      return (
        <Tool
          key={index.toString()}
          $rows={$rows}
          $columns={$columns}
          $dataMap={$dataMap}
        />
      );
    });
  }, [$columns, $dataMap, $rows, tools, toolsMap]);
};
