import { Formik } from 'formik';
import noop from 'lodash/noop';
import React from 'react';
import styled from 'styled-components';

import EditButton from '@/components/common/EditButton';
import { StyledEditWrapper } from '@/components/common/Section/SectionStyles';
import { ApiGen_CodeTypes_LeaseStatusTypes } from '@/models/api/generated/ApiGen_CodeTypes_LeaseStatusTypes';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { defaultApiLease } from '@/models/defaultInitializers';
import { exists } from '@/utils';

import DetailAdministration from './DetailAdministration';
import { DetailFeeDetermination } from './DetailFeeDetermination';
import { LeaseDetailSummaryView } from './LeaseDetailView';
import { LeaseRenewalsView } from './LeaseRenewalsView';
import PropertiesInformation from './PropertiesInformation';

export interface ILeaseDetailsViewProps {
  lease?: ApiGen_Concepts_Lease;
  canEdit: boolean;
  onGenerate: (lease?: ApiGen_Concepts_Lease) => void;
  onEdit: () => void;
}

export const LeaseDetailsView: React.FunctionComponent<ILeaseDetailsViewProps> = ({
  lease,
  canEdit,
  onGenerate,
  onEdit,
}) => {
  const displayLeaseTerminationMessage = () => {
    return (
      lease &&
      (lease.fileStatusTypeCode.id === ApiGen_CodeTypes_LeaseStatusTypes.DISCARD ||
        lease.fileStatusTypeCode.id === ApiGen_CodeTypes_LeaseStatusTypes.TERMINATED)
    );
  };

  const getTerminationMessage = (): string => {
    if (lease.fileStatusTypeCode.id === ApiGen_CodeTypes_LeaseStatusTypes.DISCARD) {
      return lease.cancellationReason;
    } else {
      return lease.terminationReason;
    }
  };

  if (!exists(lease)) {
    return <></>;
  }

  return (
    <Formik
      initialValues={{ ...defaultApiLease(), ...lease }}
      enableReinitialize={true}
      onSubmit={noop}
    >
      <StyledDetails>
        <StyledTerminationWrapper>
          {displayLeaseTerminationMessage() && (
            <StyledTerminationMessage>{getTerminationMessage()}</StyledTerminationMessage>
          )}
          {canEdit && (
            <StyledEditWrapper className="mr-3 my-1">
              <EditButton title="Edit checklist" onClick={onEdit} />
            </StyledEditWrapper>
          )}
        </StyledTerminationWrapper>
        <LeaseDetailSummaryView lease={lease} onGenerate={onGenerate} />
        <LeaseRenewalsView renewals={lease.renewals} />
        <PropertiesInformation disabled={true} />
        <DetailAdministration disabled={true} />
        <DetailFeeDetermination disabled={true} />
      </StyledDetails>
    </Formik>
  );
};

export const StyledDetails = styled.form`
  text-align: left;
  input:disabled,
  select:disabled,
  textarea:disabled {
    background: none;
    border: none;
    resize: none;
    height: fit-content;
    padding: 0;
  }
  textarea:disabled {
    padding-left: 0;
  }
  .input-group.disabled {
    .input-group-text {
      background: none;
      border: none;
      font-size: 1.6rem;
      padding: 0;
    }
    .input {
      height: 100%;
      input {
        width: fit-content;
        height: 100%;
      }
    }
  }
`;

const StyledTerminationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const StyledTerminationMessage = styled.div`
  flex-grow: 1;
  margin-top: 1.5rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  padding: 0.5rem;
  background-color: white;
  border-radius: 0.5rem;
  align-content: center;
  text-align: center;
  font-style: italic;
`;

export default LeaseDetailsView;
