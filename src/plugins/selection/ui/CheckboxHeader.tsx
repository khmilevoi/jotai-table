import { Box } from '@chakra-ui/react';
import { useAtomValue, useSetAtom } from 'jotai';

import { StyledCheckbox } from '@/shared/ui';

import { SelectionPluginModel } from '../model';

export type CheckboxHeaderProps<Data> = {
  model: SelectionPluginModel<Data>;
};

export const CheckboxHeader = <Data,>({ model }: CheckboxHeaderProps<Data>) => {
  const status = useAtomValue(model.getStatus());
  const setStatus = useSetAtom(model.setStatus());

  return (
    <Box
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <StyledCheckbox
        isChecked={status === 'active'}
        isIndeterminate={status === 'partial'}
        onChange={(event) => {
          setStatus(event.target.checked);
        }}
      />
    </Box>
  );
};
