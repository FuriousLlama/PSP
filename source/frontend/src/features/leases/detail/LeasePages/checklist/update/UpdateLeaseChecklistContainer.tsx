import { AxiosError } from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import * as API from '@/constants/API';
import { SideBarContext } from '@/features/mapSideBar/context/sidebarContext';
import usePathResolver from '@/features/mapSideBar/shared/sidebarPathSolver';
import { IUpdateChecklistFormProps } from '@/features/mapSideBar/shared/tabs/checklist/update/UpdateChecklistForm';
import { TabRouteType } from '@/features/mapSideBar/shared/tabs/RouterTabs';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { IApiError } from '@/interfaces/IApiError';
import { ApiGen_Concepts_FileChecklistItem } from '@/models/api/generated/ApiGen_Concepts_FileChecklistItem';
import { exists } from '@/utils';

export interface IUpdateLeaseChecklistContainerProps {
  leaseId: number;
  View: React.FC<IUpdateChecklistFormProps>;
}

const UpdateLeaseChecklistContainer: React.FC<IUpdateLeaseChecklistContainerProps> = ({
  leaseId,
  View,
}) => {
  const [checklist, setChecklist] = useState<ApiGen_Concepts_FileChecklistItem[]>([]);
  const {
    getLeaseChecklist: { execute: getChecklist, loading: getLoading },
    putLeaseChecklist: { execute: updateChecklist, loading: putLoading },
  } = useLeaseRepository();

  const { setStaleLastUpdatedBy } = useContext(SideBarContext);

  const pathResolver = usePathResolver();

  const fetchChecklist = useCallback(async () => {
    const checklistResponse = await getChecklist(leaseId);

    if (exists(checklistResponse)) {
      setChecklist(checklistResponse);
    }
  }, [getChecklist, leaseId]);

  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  const saveChecklist = async (checklist: ApiGen_Concepts_FileChecklistItem[]) => {
    return updateChecklist(leaseId, checklist);
  };

  const onUpdateSuccess = async () => {
    setStaleLastUpdatedBy(true);
    pathResolver.showDetail('lease', leaseId, TabRouteType.checklist, true);
  };

  const onClose = async () => {
    pathResolver.showDetail('lease', leaseId, TabRouteType.checklist, true);
  };

  // generic error handler.
  const onError = (e: AxiosError<IApiError>) => {
    if (e?.response?.status === 400) {
      toast.error(e?.response.data.error);
    } else {
      toast.error('Unable to save. Please try again.');
    }
  };

  return (
    <View
      isLoading={getLoading || putLoading}
      checklistItems={checklist}
      onSave={saveChecklist}
      onClose={onClose}
      onSuccess={onUpdateSuccess}
      onError={onError}
      sectionTypeName={API.LEASE_CHECKLIST_SECTION_TYPES}
      statusTypeName={API.LEASE_CHECKLIST_ITEM_STATUS_TYPES}
      prefix="ls"
    />
  );
};

export default UpdateLeaseChecklistContainer;
