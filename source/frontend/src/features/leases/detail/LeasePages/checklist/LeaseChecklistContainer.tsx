import React, { useCallback, useEffect, useState } from 'react';

import { Claims } from '@/constants';
import * as API from '@/constants/API';
import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { IChecklistViewProps } from '@/features/mapSideBar/shared/tabs/checklist/detail/ChecklistView';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import useKeycloakWrapper from '@/hooks/useKeycloakWrapper';
import useTraceUpdate from '@/hooks/util/useTraceUpdate';
import { ApiGen_Concepts_FileChecklistItem } from '@/models/api/generated/ApiGen_Concepts_FileChecklistItem';
import { exists } from '@/utils';

const LeaseChecklistContainer: React.FunctionComponent<
  React.PropsWithChildren<TabInteractiveContainerProps<IChecklistViewProps>>
> = props => {
  useTraceUpdate(props);
  const [checklist, setChecklist] = useState<ApiGen_Concepts_FileChecklistItem[]>([]);
  const keycloak = useKeycloakWrapper();
  const pathResolver = props.pathResolverHook();

  const showEditButton = keycloak.hasClaim(Claims.LEASE_EDIT);

  const { getLeaseChecklist } = useLeaseRepository();
  const getLease = getLeaseChecklist.execute;

  const fetchChecklist = useCallback(async () => {
    const result = await getLease(props.fileId);
    if (exists(result)) {
      setChecklist(result);
    }
  }, [props.fileId, getLease]);

  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  const onEdit = () => {
    pathResolver.editDetails('lease', props.fileId, 'checklist');
  };

  const View = props.View;

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
