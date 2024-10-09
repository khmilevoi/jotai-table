import { CaretDown, CaretUp } from '@carbon/icons-react';
import { JotaiTableRow } from '@jotai-table';
import { DetailsPluginModel } from '@jotai-table/plugins/details/model';
import { useJotaiTable } from '@jotai-table/ui/context';
import { useAtom, useAtomValue } from 'jotai';
import { PropsWithChildren, type ReactNode, useMemo } from 'react';

import {
  StyledDetailsButtonTd,
  StyledDetailsTd,
  StyledDetailsTr,
} from './styles';

export const CollapseWrapper = <Data,>({
  row,
  children,
  model,
  renderDetails,
}: PropsWithChildren<{
  row: JotaiTableRow<Data>;
  renderDetails: (props: { data: Data }) => ReactNode;
  model: DetailsPluginModel<Data>;
}>) => {
  return (
    <CollapsableRow row={row} model={model} renderDetails={renderDetails}>
      {children}
    </CollapsableRow>
  );
};

const CollapsableRow = <Data,>({
  row,
  children,
  model,
  renderDetails,
}: PropsWithChildren<{
  row: JotaiTableRow<Data>;
  renderDetails: (props: { data: Data }) => ReactNode;
  model: DetailsPluginModel<Data>;
}>) => {
  const [isCollapsed, setIsCollapsed] = useAtom(
    useMemo(() => model.getStatus(row.id), [model, row.id]),
  );

  return (
    <>
      <StyledDetailsTr
        key={`row-${row.id}`}
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        {children}

        <StyledDetailsButtonTd colSpan={0}>
          <button>{isCollapsed ? <CaretDown /> : <CaretUp />}</button>
        </StyledDetailsButtonTd>
      </StyledDetailsTr>

      {!isCollapsed && <Details row={row} renderDetails={renderDetails} />}
    </>
  );
};

const Details = <Data,>({
  row,
  renderDetails,
}: {
  row: JotaiTableRow<Data>;
  renderDetails: (props: { data: Data }) => ReactNode;
}) => {
  const { $columns } = useJotaiTable();

  const columns = useAtomValue($columns);

  const details = useMemo(
    () => renderDetails({ data: row.data }),
    [renderDetails, row.data],
  );

  return (
    <tr key={'row-details'}>
      <StyledDetailsTd colSpan={columns.length + 1}>{details}</StyledDetailsTd>
    </tr>
  );
};
