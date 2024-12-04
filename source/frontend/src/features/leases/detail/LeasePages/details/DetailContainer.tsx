import React, { useCallback, useEffect, useState } from 'react';

import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { Claims } from '@/constants';
import { useGenerateLicenceOfOccupation } from '@/features/mapSideBar/acquisition/common/GenerateForm/hooks/useGenerateLicenceOfOccupation';
import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { TabRouteType } from '@/features/mapSideBar/shared/tabs/RouterTabs';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { usePropertyLeaseRepository } from '@/hooks/repositories/usePropertyLeaseRepository';
import useKeycloakWrapper from '@/hooks/useKeycloakWrapper';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { exists } from '@/utils';

import { ILeaseDetailsViewProps } from './LeaseDetailsForm';

const LeaseDetailContainer: React.FunctionComponent<
  React.PropsWithChildren<TabInteractiveContainerProps<ILeaseDetailsViewProps>>
> = ({ fileId, pathResolverHook, View }) => {
  const [lease, setLease] = useState<ApiGen_Concepts_Lease | null>(null);

  const { hasClaim } = useKeycloakWrapper();

  const {
    getLease: { execute: getLease },
    getLeaseRenewals: { execute: getRenewals },
  } = useLeaseRepository();

  const {
    getPropertyLeases: { execute: getPropertyLeases, loading: propertyLeasesLoading },
  } = usePropertyLeaseRepository();

  const fetchLease = useCallback(async () => {
    const getLeasePromise = getLease(fileId);
    const getRenewalsPromise = getRenewals(fileId);
    const getPropertiesPromise = getPropertyLeases(fileId);

    const [leaseResponse, renewalsResponse, propertiesResponse] = await Promise.all([
      getLeasePromise,
      getRenewalsPromise,
      getPropertiesPromise,
    ]);

    if (exists(leaseResponse) && exists(propertiesResponse)) {
      leaseResponse.renewals = renewalsResponse;
      leaseResponse.fileProperties = propertiesResponse;
      setLease(leaseResponse);
    }
  }, [fileId, getLease, getPropertyLeases, getRenewals]);

  useEffect(() => {
    fetchLease();
  }, [fetchLease]);

  const resolver = pathResolverHook();
  const generateLicenceOfOccupation = useGenerateLicenceOfOccupation();

  const onGenerate = useCallback(
    (lease?: ApiGen_Concepts_Lease) => {
      if (exists(lease)) {
        generateLicenceOfOccupation(lease);
      }
    },
    [generateLicenceOfOccupation],
  );

  const onEdit = () => {
    resolver.editDetails('lease', fileId, TabRouteType.fileDetails);
  };

  const canEdit = hasClaim([Claims.LEASE_EDIT]);

  if (!exists(lease)) {
    return <LoadingBackdrop />;
  } else {
    return <View lease={lease} canEdit={canEdit} onEdit={onEdit} onGenerate={onGenerate} />;
  }
};

export default LeaseDetailContainer;
