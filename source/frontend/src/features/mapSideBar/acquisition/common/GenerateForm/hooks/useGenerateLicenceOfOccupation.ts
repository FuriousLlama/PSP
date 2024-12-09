import { createFileDownload } from '@/features/documents/DownloadDocumentButton';
import { useDocumentGenerationRepository } from '@/features/documents/hooks/useDocumentGenerationRepository';
import { useApiLeases } from '@/hooks/pims-api/useApiLeases';
import { useInsurancesRepository } from '@/hooks/repositories/useInsuranceRepository';
import { useLeasePeriodRepository } from '@/hooks/repositories/useLeasePeriodRepository';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { useLeaseStakeholderRepository } from '@/hooks/repositories/useLeaseStakeholderRepository';
import { usePropertyLeaseRepository } from '@/hooks/repositories/usePropertyLeaseRepository';
import { useSecurityDepositRepository } from '@/hooks/repositories/useSecurityDepositRepository';
import { useApiRequestWrapper } from '@/hooks/util/useApiRequestWrapper';
import { ApiGen_CodeTypes_ExternalResponseStatus } from '@/models/api/generated/ApiGen_CodeTypes_ExternalResponseStatus';
import { ApiGen_CodeTypes_FormTypes } from '@/models/api/generated/ApiGen_CodeTypes_FormTypes';
import { ApiGen_CodeTypes_LeaseLicenceTypes } from '@/models/api/generated/ApiGen_CodeTypes_LeaseLicenceTypes';
import { Api_GenerateLease } from '@/models/generate/lease/GenerateLease';
import { exists, useAxiosErrorHandler } from '@/utils';

export const useGenerateLicenceOfOccupation = () => {
  const { generateDocumentDownloadWrappedRequest: generate } = useDocumentGenerationRepository();
  const {
    getInsurances: { execute: getInsurances },
  } = useInsurancesRepository();

  const {
    getLeaseStakeholders: { execute: getLeaseStakeholders },
  } = useLeaseStakeholderRepository();

  const {
    getLeaseRenewals: { execute: getLeaseRenewals },
  } = useLeaseRepository();

  const {
    getSecurityDeposits: { execute: getLeaseDeposits },
  } = useSecurityDepositRepository();

  const {
    getLeasePeriods: { execute: getLeasePeriods },
  } = useLeasePeriodRepository();

  const {
    getPropertyLeases: { execute: getPropertyLeases },
  } = usePropertyLeaseRepository();

  const { getApiLease } = useApiLeases();
  const { execute: getLease } = useApiRequestWrapper({
    requestFunction: getApiLease,
    requestName: 'getApiLease',
    onError: useAxiosErrorHandler('Failed to load lease, reload this page to try again.'),
  });

  const VALID_LICENCE_TYPES = [
    ApiGen_CodeTypes_LeaseLicenceTypes.LOOBCTFA.toString(),
    ApiGen_CodeTypes_LeaseLicenceTypes.LIPPUBHWY.toString(),
  ];

  const generateLicenceOfOccupation = async (leaseId: number) => {
    if (leaseId) {
      const updatedLeasePromise = getLease(leaseId);
      const insurancesPromise = getInsurances(leaseId);
      const stakeholdersPromise = getLeaseStakeholders(leaseId);
      const renewalsPromise = getLeaseRenewals(leaseId);
      const securityDepositsPromise = getLeaseDeposits(leaseId);
      const periodsPromise = getLeasePeriods(leaseId);
      const propertyLeasesPromise = getPropertyLeases(leaseId);
      const [
        updatedLease,
        insurances,
        stakeholders,
        renewals,
        securityDeposits,
        periods,
        propertyLeases,
      ] = await Promise.all([
        updatedLeasePromise,
        insurancesPromise,
        stakeholdersPromise,
        renewalsPromise,
        securityDepositsPromise,
        periodsPromise,
        propertyLeasesPromise,
      ]);

      if (!exists(updatedLease)) {
        throw new Error('Failed to load lease, reload this page to try again.');
      }

      if (!updatedLease.leaseType?.id || !VALID_LICENCE_TYPES.includes(updatedLease.leaseType.id)) {
        throw new Error('Invalid licence type.');
      }

      const leaseData = new Api_GenerateLease(
        updatedLease,
        insurances ?? [],
        stakeholders ?? [],
        renewals ?? [],
        securityDeposits ?? [],
        propertyLeases ?? [],
        periods ?? [],
      );

      let formTemplateType: ApiGen_CodeTypes_FormTypes;
      switch (updatedLease.leaseType.id) {
        case ApiGen_CodeTypes_LeaseLicenceTypes.LOOBCTFA:
          formTemplateType = ApiGen_CodeTypes_FormTypes.H1005A;
          break;
        case ApiGen_CodeTypes_LeaseLicenceTypes.LIPPUBHWY:
          formTemplateType = ApiGen_CodeTypes_FormTypes.H1005;
          break;
        default:
          throw new Error('Invalid licence type.');
      }

      const generatedFile = await generate({
        templateType: formTemplateType.toString(),
        templateData: leaseData,
        convertToType: null,
      });
      if (
        generatedFile?.status === ApiGen_CodeTypes_ExternalResponseStatus.Success &&
        generatedFile?.payload
      ) {
        createFileDownload(generatedFile?.payload);
      } else {
        throw Error('Failed to generate file');
      }
      return generatedFile;
    }
  };

  return generateLicenceOfOccupation;
};
