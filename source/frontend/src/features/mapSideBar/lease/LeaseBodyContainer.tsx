import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { usePropertyLeaseRepository } from '@/hooks/repositories/usePropertyLeaseRepository';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { exists, stripTrailingSlash } from '@/utils';

import { IFileBodyViewProps } from '../shared/fileBody/fileBodyView';
import { getLeaseTabs } from './tabs/leaseTabs';

export interface ILeaseBodyContainerProps {
  leaseFileId: number;
  View: React.FunctionComponent<React.PropsWithChildren<IFileBodyViewProps>>;
}

export const LeaseBodyContainer: React.FunctionComponent<ILeaseBodyContainerProps> = props => {
  const { leaseFileId, View } = props;

  const history = useHistory();
  const match = useRouteMatch();

  const {
    getPropertyLeases: { execute: getPropertyLeases, loading: propertyLeasesLoading },
  } = usePropertyLeaseRepository();

  const [lease, setLease] = useState<ApiGen_Concepts_Lease | null>(null);
  const { getLease } = useLeaseRepository();
  const getLeaseExecute = getLease.execute;

  const fetchLease = useCallback(async () => {
    const result = await getLeaseExecute(leaseFileId);

    if (exists(result)) {
      const properties = await getPropertyLeases(leaseFileId);
      result.fileProperties = properties;

      setLease(result);
    }
  }, [getLeaseExecute, leaseFileId, getPropertyLeases]);

  useEffect(() => {
    fetchLease();
  }, [fetchLease]);

  const onSelectFileSummary = () => {
    history.push(`${stripTrailingSlash(match.url)}/file`);
  };

  const onSelectProperty = (propertyId: number) => {
    const route = `/property/${propertyId}`;
    history.push(`${stripTrailingSlash(match.url)}${route}`);
  };

  const onEditProperties = () => {
    history.push(`/mapview/sidebar/edit-properties/lease/${props.leaseFileId}`);
  };

  const onSuccess = () => {
    console.log('called!');
  };

  const tabs = useMemo(() => getLeaseTabs(lease, onSuccess), [lease]);

  // UI components
  if (getLease.loading || propertyLeasesLoading) {
    return <LoadingBackdrop show={true} parentScreen={true} />;
  }

  if (!exists(lease)) {
    return <></>;
  }

  return (
    <View
      fileProperties={lease.fileProperties}
      onSelectFileSummary={onSelectFileSummary}
      onSelectProperty={onSelectProperty}
      onEditProperties={onEditProperties}
      canEdit={true}
      fileType={ApiGen_CodeTypes_FileTypes.Lease}
      fileTabs={tabs}
    />
  );
};

export default LeaseBodyContainer;
