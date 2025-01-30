import styled from 'styled-components';

import EditButton from '@/components/common/buttons/EditButton';
import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { Section } from '@/components/common/Section/Section';
import { StyledEditWrapper } from '@/components/common/Section/SectionStyles';
import { ApiGen_Concepts_LeaseStakeholderType } from '@/models/api/generated/ApiGen_Concepts_LeaseStakeholderType';

import { FormStakeholder } from './models';
import TenantOrganizationContactInfo from './StakeholderOrganizationContactInfo';
import TenantPersonContactInfo from './StakeholderPersonContactInfo';

export interface ILeaseStakeholderViewProps {
  canEdit: boolean;
  onEdit: () => void;
  stakeholders: FormStakeholder[];
  leaseStakeholderTypes?: ApiGen_Concepts_LeaseStakeholderType[];
  loading?: boolean;
  isPayableLease?: boolean;
}

/**
 * Tenant lease page displays all tenant information (persons and organizations)
 * @param {ITenantProps} param0
 */
export const LeaseStakeholderView: React.FunctionComponent<
  React.PropsWithChildren<ILeaseStakeholderViewProps>
> = ({ canEdit, onEdit, stakeholders, loading, leaseStakeholderTypes, isPayableLease }) => {
  return (
    <>
      {canEdit && (
        <StyledEditWrapper className="mr-3 my-1">
          <EditButton title="Edit checklist" onClick={onEdit} style={{ float: 'right' }} />
        </StyledEditWrapper>
      )}
      <>
        <LoadingBackdrop show={loading} parentScreen />

        {leaseStakeholderTypes
          .filter(stakeholderType => stakeholderType.isPayableRelated === isPayableLease)
          .map((stakeholderTypeCode: ApiGen_Concepts_LeaseStakeholderType) => {
            return (
              <Section
                header={stakeholderTypeCode.description}
                key={`stakeholder-type-${stakeholderTypeCode.code}`}
                className="my-3"
              >
                {stakeholders.map((stakeholder: FormStakeholder, index) =>
                  stakeholder.stakeholderType === stakeholderTypeCode.code ? (
                    <div key={`stakeholders-${index}`}>
                      <>
                        {stakeholder.organizationId ? (
                          <TenantOrganizationContactInfo stakeholder={stakeholder} />
                        ) : (
                          <TenantPersonContactInfo stakeholder={stakeholder} />
                        )}
                      </>
                    </div>
                  ) : null,
                )}
              </Section>
            );
          })}
        {stakeholders.length === 0 && (
          <StyledSection>
            <p>There are no stakeholders associated to this lease.</p>
            <p>Click the edit icon to add stakeholders.</p>
          </StyledSection>
        )}
      </>
    </>
  );
};

const StyledSection = styled(Section)`
  background-color: transparent;
  padding-left: 0.5rem;
  margin-bottom: 0;
`;

export default LeaseStakeholderView;
