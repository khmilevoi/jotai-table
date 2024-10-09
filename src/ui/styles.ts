import { Table } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const StyledTable = styled(Table)`
  --border-color: #8d8682;
  border-collapse: separate;
  border-spacing: 0;

  thead th {
    box-shadow:
      0 -1px 0 var(--border-color),
      0 1px 0 var(--border-color);
    border-top: none;
    background-color: #e8ebef;
    color: black;
    text-transform: capitalize;

    position: sticky;
    top: 4px;
    z-index: 1;
  }

  tr {
    position: relative;
  }

  th:first-of-type {
    border-radius: 6px 0 0 6px;
    box-shadow:
      -1px 0 0 var(--border-color),
      0 -1px 0 var(--border-color),
      0 1px 0 var(--border-color);
  }

  th:last-child {
    border-radius: 0 6px 6px 0;
    box-shadow:
      1px 0 0 var(--border-color),
      0 -1px 0 var(--border-color),
      0 1px 0 var(--border-color);
  }
`;
