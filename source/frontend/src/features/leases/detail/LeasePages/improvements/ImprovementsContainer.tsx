import React, { useEffect } from 'react';

import { Claims } from '@/constants';
import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { TabRouteType } from '@/features/mapSideBar/shared/tabs/RouterTabs';
import { usePropertyImprovementRepository } from '@/hooks/repositories/usePropertyImprovementRepository';
import useKeycloakWrapper from '@/hooks/useKeycloakWrapper';

import { IImprovementsViewProps } from './ImprovementsView';

export const ImprovementsContainer: React.FunctionComponent<
  React.PropsWithChildren<TabInteractiveContainerProps<IImprovementsViewProps>>
> = ({ fileId, pathResolverHook, View }) => {
  const {
    getPropertyImprovements: { execute: getPropertyImprovements, loading, response: improvements },
  } = usePropertyImprovementRepository();

  useEffect(() => {
    fileId && getPropertyImprovements(fileId);
  }, [getPropertyImprovements, fileId]);

  const pathResolver = pathResolverHook();

  const onEdit = () => {
    pathResolver.editDetails('lease', fileId, TabRouteType.improvements);
  };

  const { hasClaim } = useKeycloakWrapper();
  const canEdit = hasClaim([Claims.LEASE_EDIT]);

  return (
    <View improvements={improvements ?? []} canEdit={canEdit} onEdit={onEdit} loading={loading} />
  );
};
