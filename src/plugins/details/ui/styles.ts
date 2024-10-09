import { Tr } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const StyledDetailsTr = styled(Tr)`
  cursor: pointer;
`;

export const StyledDetailsButtonTd = styled.td`
  width: 0;
  position: relative;

  button {
    top: 0;
    width: 24px;
    height: 100%;
    position: absolute;
    cursor: pointer;
    transform: translateX(-100%);
  }
`;

export const StyledDetailsTd = styled.td`
  width: 100%;
  padding: 8px 24px 12px;
  border-bottom-width: 1px;
  background-color: #fafafa;
`;
