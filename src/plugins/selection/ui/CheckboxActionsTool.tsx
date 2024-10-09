import { ChevronDown } from '@carbon/icons-react';
import { Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { memo } from 'react';

import { StyledButton } from '@/shared/ui';

import { SelectionPluginModel } from '../model';
import { SelectionAction } from '../types';

type CheckboxActionsToolProps<Data> = {
  model: SelectionPluginModel<Data>;
  actions: SelectionAction[];
};

export const CheckboxActionsTool = <Data,>({
  model,
  actions,
}: CheckboxActionsToolProps<Data>) => {
  const isSelected = useAtomValue(model.getIsSelected());

  if (actions === undefined) {
    return null;
  }

  return (
    <Flex>
      <Menu>
        <MenuButton
          as={StyledButton}
          width={'150px'}
          rightIcon={<ChevronDown />}
          isDisabled={!isSelected}
        >
          Update
        </MenuButton>
        <Actions actions={actions} />
      </Menu>
    </Flex>
  );
};

const Actions = memo(({ actions }: { actions: SelectionAction[] }) => {
  return (
    <MenuList zIndex={2}>
      {actions.map((action) => (
        <MenuItem key={action.id} onClick={action.action}>
          {action.label}
        </MenuItem>
      ))}
    </MenuList>
  );
});
Actions.displayName = 'Actions';
