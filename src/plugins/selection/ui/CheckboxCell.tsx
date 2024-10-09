import { Box } from '@chakra-ui/react';
import { PrimitiveAtom, useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

import { StyledCheckbox } from '@/shared/ui';

export type CheckboxCellProps = {
  $isActive: PrimitiveAtom<boolean>;
};

export const CheckboxCell = ({ $isActive }: CheckboxCellProps) => {
  const isActive = useAtomValue($isActive);

  const toggleAtom = useAtomCallback((_get, set, nextIsActive: boolean) => {
    set($isActive, nextIsActive);
  });

  return (
    <Box
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <StyledCheckbox
        isChecked={isActive}
        onChange={(event) => {
          toggleAtom(event.target.checked);
        }}
      />
    </Box>
  );
};
