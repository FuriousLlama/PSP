import { useCallback } from 'react';

import { FormDocumentType } from '@/constants/formDocumentTypes';
import { ApiGen_CodeTypes_LeaseLicenceTypes } from '@/models/api/generated/ApiGen_CodeTypes_LeaseLicenceTypes';

import { FormDocumentEntry } from '../acquisition/common/GenerateForm/formDocumentEntry';
import { IGenerateFormViewProps } from '../acquisition/common/GenerateForm/GenerateFormView';
import { useGenerateLicenceOfOccupation } from '../acquisition/common/GenerateForm/hooks/useGenerateLicenceOfOccupation';

export interface ILeaseGenerateContainerProps {
  leaseId: number;
  leaseType: string;
  View: React.FunctionComponent<React.PropsWithChildren<IGenerateFormViewProps>>;
}

const LeaseGenerateContainer: React.FunctionComponent<
  React.PropsWithChildren<ILeaseGenerateContainerProps>
> = ({ leaseId, leaseType, View }) => {
  const generateLicenceOfOccupation = useGenerateLicenceOfOccupation();

  const onGenerate = useCallback(
    (leaseId: number) => {
      debugger;
      generateLicenceOfOccupation(leaseId);
    },
    [generateLicenceOfOccupation],
  );

  const onGenerateClick = (formType: FormDocumentType) => {
    switch (formType) {
      case FormDocumentType.H1005_A:
        onGenerate(leaseId);
        break;
      case FormDocumentType.H1005:
        onGenerate(leaseId);
        break;
      default:
        console.error('Form Document type not recognized');
    }
  };

  const formEntries: FormDocumentEntry[] = [];

  if (leaseType === ApiGen_CodeTypes_LeaseLicenceTypes.LOOBCTFA) {
    formEntries.push({ formType: FormDocumentType.H1005_A, text: 'Generate H1005(a)' });
  }
  if (leaseType === ApiGen_CodeTypes_LeaseLicenceTypes.LIPPUBHWY) {
    formEntries.push({ formType: FormDocumentType.H1005, text: 'Generate H1005 ' });
  }

  return (
    <View
      formEntries={formEntries}
      onGenerateClick={onGenerateClick}
      isLoading={false}
      letterRecipientsInitialValues={[]}
      openGenerateLetterModal={null}
      onGenerateLetterCancel={null}
      onGenerateLetterOk={null}
    />
  );
};

export default LeaseGenerateContainer;
