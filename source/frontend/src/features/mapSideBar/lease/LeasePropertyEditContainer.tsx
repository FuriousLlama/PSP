import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { useAcquisitionProvider } from '@/hooks/repositories/useAcquisitionProvider';
import { usePropertyAssociations } from '@/hooks/repositories/usePropertyAssociations';
import useApiUserOverride from '@/hooks/useApiUserOverride';
import { useModalContext } from '@/hooks/useModalContext';
import { IApiError } from '@/interfaces/IApiError';
import { ApiGen_Concepts_AcquisitionFile } from '@/models/api/generated/ApiGen_Concepts_AcquisitionFile';
import { ApiGen_Concepts_File } from '@/models/api/generated/ApiGen_Concepts_File';
import { UserOverrideCode } from '@/models/api/UserOverrideCode';
import { exists, isValidId } from '@/utils';

import UpdatePropertiesView from '../shared/update/properties/UpdateProperties';

interface ILeasePropertyEditContainer {
  leaseId: number;
  onSuccess: () => void;
}

export const LeasePropertyEditContainer: React.FunctionComponent<ILeasePropertyEditContainer> = ({
  leaseId,
  onSuccess,
}) => {
  const [acquisitionFile, setAcquisitionFile] = useState<ApiGen_Concepts_AcquisitionFile | null>(
    null,
  );

  const history = useHistory();
  const match = useRouteMatch();

  const withUserOverride = useApiUserOverride<
    (userOverrideCodes: UserOverrideCode[]) => Promise<any | void>
  >('Failed to update Acquisition File');

  const { execute: getPropertyAssociations } = usePropertyAssociations();

  const { setModalContent, setDisplayModal } = useModalContext();

  const {
    getAcquisitionFile: { execute: retrieveAcquisitionFile, loading: loadingAcquisitionFile },
    updateAcquisitionProperties,
    getAcquisitionProperties: {
      execute: retrieveAcquisitionFileProperties,
      loading: loadingAcquisitionFileProperties,
    },
  } = useAcquisitionProvider();

  const fetchAcquisitionFile = useCallback(async () => {
    // NOTE: The view does not seem like it uses the file itself, only the properties.
    // Assess if the file needs to be retrieved.
    const retrieved = await retrieveAcquisitionFile(leaseId);
    if (exists(retrieved)) {
      const acquisitionProperties = await retrieveAcquisitionFileProperties(leaseId);

      retrieved.fileProperties = acquisitionProperties ?? null;
      setAcquisitionFile(retrieved);
    }
  }, [leaseId, retrieveAcquisitionFileProperties, retrieveAcquisitionFile]);

  useEffect(() => {
    fetchAcquisitionFile();
  }, [fetchAcquisitionFile, leaseId]);

  const isFileLoading = useMemo(
    () => loadingAcquisitionFile || loadingAcquisitionFileProperties,
    [loadingAcquisitionFile, loadingAcquisitionFileProperties],
  );

  const onUpdateProperties = (
    file: ApiGen_Concepts_File,
  ): Promise<ApiGen_Concepts_File | undefined> => {
    // The backend does not update the product or project so its safe to send nulls even if there might be data for those fields.
    return withUserOverride(
      (userOverrideCodes: UserOverrideCode[]) => {
        return updateAcquisitionProperties
          .execute(
            {
              ...(file as ApiGen_Concepts_AcquisitionFile),
              productId: null,
              projectId: null,
              fileChecklistItems: [],
            },
            userOverrideCodes,
          )
          .then(response => {
            onSuccess();
            return response;
          });
      },
      [],
      (axiosError: AxiosError<IApiError>) => {
        setModalContent({
          variant: 'error',
          title: 'Error',
          message: axiosError?.response?.data.error,
          okButtonText: 'Close',
        });
        setDisplayModal(true);
      },
    );
  };

  // Warn user that property is part of an existing acquisition file
  const confirmBeforeAdd = useCallback(
    async (propertyId: number | null): Promise<boolean> => {
      if (isValidId(propertyId)) {
        const response = await getPropertyAssociations(propertyId);
        const acquisitionAssociations = response?.acquisitionAssociations ?? [];
        const otherAcqFiles = acquisitionAssociations.filter(a => exists(a.id) && a.id !== leaseId);
        return otherAcqFiles.length > 0;
      } else {
        // the property is not in PIMS db -> no need to confirm
        return false;
      }
    },
    [getPropertyAssociations, leaseId],
  );

  const closePropertySelector = () => {
    onSuccess();
  };

  const canRemove = async () => {
    return true;
  };

  if (!exists(acquisitionFile)) {
    return <></>;
  }

  return (
    <UpdatePropertiesView
      isFileLoading={isFileLoading}
      file={acquisitionFile}
      setIsShowingPropertySelector={closePropertySelector}
      onSuccess={onSuccess}
      updateFileProperties={onUpdateProperties}
      confirmBeforeAdd={confirmBeforeAdd}
      confirmBeforeAddMessage={
        <>
          <p>This property has already been added to one or more acquisition files.</p>
          <p>Do you want to acknowledge and proceed?</p>
        </>
      }
      canRemove={canRemove}
    />
  );
};

export default LeasePropertyEditContainer;
