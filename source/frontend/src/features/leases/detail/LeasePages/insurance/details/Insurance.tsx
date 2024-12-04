import React, { useMemo } from 'react';

import EditButton from '@/components/common/EditButton';
import { Section } from '@/components/common/Section/Section';
import { StyledEditWrapper } from '@/components/common/Section/SectionStyles';
import { ApiGen_Concepts_Insurance } from '@/models/api/generated/ApiGen_Concepts_Insurance';
import { ILookupCode } from '@/store/slices/lookupCodes';

import Policy from './Policy';
import { InsuranceTypeList } from './styles';

export interface InsuranceDetailsViewProps {
  canEdit: boolean;
  onEdit: () => void;
  insuranceList: ApiGen_Concepts_Insurance[];
  insuranceTypes: ILookupCode[];
}

const InsuranceDetailsView: React.FunctionComponent<
  React.PropsWithChildren<InsuranceDetailsViewProps>
> = ({ canEdit, onEdit, insuranceList, insuranceTypes }) => {
  const sortedInsuranceList = useMemo(
    () =>
      insuranceList?.length
        ? insuranceList.sort((a, b) => {
            return (
              insuranceTypes.findIndex(i => i.id === a.insuranceType?.displayOrder) -
              insuranceTypes.findIndex(i => i.id === b.insuranceType?.displayOrder)
            );
          })
        : [],
    [insuranceList, insuranceTypes],
  );
  return (
    <>
      {canEdit && (
        <StyledEditWrapper className="mr-3 my-1">
          <EditButton title="Edit Improvements" onClick={onEdit} />
        </StyledEditWrapper>
      )}
      {sortedInsuranceList.length > 0 && (
        <div data-testid="insurance-section">
          <Section header="Required insurance">
            <InsuranceTypeList>
              {sortedInsuranceList.map((insurance: ApiGen_Concepts_Insurance, index: number) => (
                <li key={`insurance-section-${insurance?.id?.toString() ?? index}`}>
                  {insurance.insuranceType?.description}
                  {insurance.insuranceType?.id === 'OTHER' && insurance.otherInsuranceType
                    ? `: ${insurance.otherInsuranceType}`
                    : ''}
                </li>
              ))}
            </InsuranceTypeList>
          </Section>

          {sortedInsuranceList.map((insurance: ApiGen_Concepts_Insurance, index: number) => (
            <div
              key={`insurance-${insurance?.id?.toString() ?? index}`}
              data-testid="insurance-section"
            >
              <Policy insurance={insurance} />
            </div>
          ))}
        </div>
      )}
      {sortedInsuranceList.length === 0 && (
        <>
          <Section>
            <p>There are no insurance policies indicated with this lease/licence</p>
          </Section>
        </>
      )}
    </>
  );
};

export default InsuranceDetailsView;
