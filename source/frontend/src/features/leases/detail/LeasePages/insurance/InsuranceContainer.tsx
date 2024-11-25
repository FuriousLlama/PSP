import orderBy from 'lodash/orderBy';
import { useContext, useEffect, useState } from 'react';

import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { INSURANCE_TYPES } from '@/constants/API';
import { LeaseStateContext } from '@/features/leases/context/LeaseContext';
import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { useInsurancesRepository } from '@/hooks/repositories/useInsuranceRepository';
import useKeycloakWrapper from '@/hooks/useKeycloakWrapper';
import useLookupCodeHelpers from '@/hooks/useLookupCodeHelpers';

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

  const { lease } = useContext(LeaseStateContext);
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
