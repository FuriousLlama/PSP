import React, { useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { useLeaseDetail } from '@/features/leases/hooks/useLeaseDetail';
import useTraceUpdate from '@/hooks/util/useTraceUpdate';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { exists, stripTrailingSlash } from '@/utils';

import { IFileBodyViewProps } from '../shared/fileBody/fileBodyView';
import { getLeaseTabs } from './tabs/leaseTabs';

export interface ILeaseBodyContainerProps {
  leaseFileId: number;
  View: React.FunctionComponent<React.PropsWithChildren<IFileBodyViewProps>>;
}

export const LeaseBodyContainer: React.FunctionComponent<ILeaseBodyContainerProps> = props => {
  useTraceUpdate(props);
  // Load state from props and side-bar context
  const { leaseFileId, View } = props;

  const history = useHistory();
  const match = useRouteMatch();

  const { lease, setLease, refresh, loading } = useLeaseDetail(leaseFileId);

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
  if (loading) {
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
