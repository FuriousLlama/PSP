import React, { useCallback, useEffect, useState } from 'react';

import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { Claims } from '@/constants';
import * as API from '@/constants/API';
import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { IChecklistViewProps } from '@/features/mapSideBar/shared/tabs/checklist/detail/ChecklistView';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import useKeycloakWrapper from '@/hooks/useKeycloakWrapper';
import { ApiGen_Concepts_FileChecklistItem } from '@/models/api/generated/ApiGen_Concepts_FileChecklistItem';
import { exists } from '@/utils';

const LeaseChecklistContainer: React.FunctionComponent<
  React.PropsWithChildren<TabInteractiveContainerProps<IChecklistViewProps>>
> = ({ fileId, pathResolverHook, View }) => {
  debugger;
  const [checklist, setChecklist] = useState<ApiGen_Concepts_FileChecklistItem[]>([]);
  const keycloak = useKeycloakWrapper();
  const pathResolver = pathResolverHook();

  const showEditButton = keycloak.hasClaim(Claims.LEASE_EDIT);

  const { getLeaseChecklist } = useLeaseRepository();

  const fetchChecklist = useCallback(async () => {
    debugger;
    const result = await getLeaseChecklist.execute(fileId);
    if (exists(result)) {
      setChecklist(result);
    }
  }, [fileId, getLeaseChecklist]);

  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  const onEdit = () => {
    pathResolver.editDetails('lease', fileId, 'checklist');
  };

  if (getLeaseChecklist.loading) {
    <LoadingBackdrop />;
  }

  return (
    <View
      checklistItems={checklist}
      onEdit={onEdit}
      sectionTypeName={API.LEASE_CHECKLIST_SECTION_TYPES}
      prefix="lease"
      canEdit={showEditButton}
    />
  );
};

export default LeaseChecklistContainer;
