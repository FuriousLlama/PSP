import orderBy from 'lodash/orderBy';
import { useCallback, useEffect, useState } from 'react';

import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { INSURANCE_TYPES } from '@/constants/API';
import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { useInsurancesRepository } from '@/hooks/repositories/useInsuranceRepository';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import useKeycloakWrapper from '@/hooks/useKeycloakWrapper';
import useLookupCodeHelpers from '@/hooks/useLookupCodeHelpers';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { exists } from '@/utils';

import { InsuranceDetailsViewProps } from './details/Insurance';

const InsuranceContainer: React.FunctionComponent<
  React.PropsWithChildren<TabInteractiveContainerProps<InsuranceDetailsViewProps>>
> = ({ fileId, pathResolverHook, View }) => {
  const { hasClaim } = useKeycloakWrapper();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const {
    getInsurances: { execute: getInsurances, loading, response: insurances },
    updateInsurances: { execute: updateInsurances },
  } = useInsurancesRepository();

  const [lease, setLease] = useState<ApiGen_Concepts_Lease | null>(null);

  const { getLease } = useLeaseRepository();
  const getLeaseExecute = getLease.execute;

  const fetchLease = useCallback(async () => {
    const result = await getLeaseExecute(fileId);
    if (exists(result)) {
      setLease(result);
    }
  }, [fileId, getLeaseExecute]);

  useEffect(() => {
    fetchLease();
  }, [fetchLease]);

  const insuranceList = orderBy(insurances, i => i.insuranceType?.displayOrder) ?? [];
  const leaseId = lease?.id;
  useEffect(() => {
    leaseId && getInsurances(leaseId);
  }, [getInsurances, leaseId]);

  const lookupCodes = useLookupCodeHelpers();
  const insuranceTypes = lookupCodes.getByType(INSURANCE_TYPES).sort((a, b) => {
    return (a.displayOrder || 0) - (b.displayOrder || 0);
  });

  return (
    <>
      <LoadingBackdrop show={loading} parentScreen />
      <View insuranceList={insuranceList} insuranceTypes={insuranceTypes} />
    </>
  );
};

export default InsuranceContainer;
