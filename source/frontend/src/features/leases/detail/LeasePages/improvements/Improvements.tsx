import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { Section } from '@/components/common/Section/Section';
import * as API from '@/constants/API';
import useLookupCodeHelpers from '@/hooks/useLookupCodeHelpers';
import { ApiGen_Concepts_PropertyImprovement } from '@/models/api/generated/ApiGen_Concepts_PropertyImprovement';

import Improvement from './components/Improvement/Improvement';
import { ILeaseImprovementForm } from './models';

export interface IImprovementsViewProps {
  improvements: ApiGen_Concepts_PropertyImprovement[];
  onEdit: () => void;
  loading: boolean;
}

export const ImprovementsView: React.FunctionComponent<IImprovementsViewProps> = ({
  improvements,
  loading,
}) => {
  const { getByType } = useLookupCodeHelpers();
  const improvementTypeCodes = getByType(API.PROPERTY_IMPROVEMENT_TYPES);
  const formImprovements = improvements.map((improvement: ApiGen_Concepts_PropertyImprovement) =>
    ILeaseImprovementForm.fromApi(improvement),
  );

  formImprovements.sort(
    (improvementOne: ILeaseImprovementForm, improvementTwo: ILeaseImprovementForm) => {
      const findDisplayOrder = (x: ILeaseImprovementForm): number => {
        for (const typeCode of improvementTypeCodes) {
          if (x.propertyImprovementTypeId === typeCode.id) {
            return typeCode.displayOrder;
          }
        }
        return 0;
      };
      return findDisplayOrder(improvementOne) - findDisplayOrder(improvementTwo);
    },
  );

  if (!improvements?.length) {
    return (
      <Section>
        <p>
          There are no commercial, residential, or other improvements indicated with this
          lease/licence.
        </p>
      </Section>
    );
  }

  return (
    <>
      <LoadingBackdrop show={loading} parentScreen />
      {formImprovements.map((improvement: ILeaseImprovementForm) => (
        <Improvement improvement={improvement} key={`improvement-${improvement?.id}`} />
      ))}
    </>
  );
};

export default ImprovementsView;
