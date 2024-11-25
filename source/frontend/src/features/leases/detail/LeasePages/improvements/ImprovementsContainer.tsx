import { useEffect } from 'react';

import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { usePropertyImprovementRepository } from '@/hooks/repositories/usePropertyImprovementRepository';

import { IImprovementsViewProps } from './Improvements';

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
    pathResolver.editDetails('lease', fileId, 'improvements');
  };

  return <View improvements={improvements ?? []} onEdit={onEdit} loading={loading} />;
};
