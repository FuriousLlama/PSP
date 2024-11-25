import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { useAcquisitionProvider } from '@/hooks/repositories/useAcquisitionProvider';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { ApiGen_Concepts_AcquisitionFile } from '@/models/api/generated/ApiGen_Concepts_AcquisitionFile';
import { exists, stripTrailingSlash } from '@/utils';

import { SideBarContext } from '../context/sidebarContext';
import { IAcquisitionFileBodyViewProps } from './AcquisitionFileBodyView';

export interface IAcquisitionFileBodyContainerProps {
  acquisitionFileId: number;
  View: React.FunctionComponent<React.PropsWithChildren<IAcquisitionFileBodyViewProps>>;
}

export const AcquisitionFileBodyContainer: React.FunctionComponent<
  IAcquisitionFileBodyContainerProps
> = props => {
  // Load state from props and side-bar context
  const { acquisitionFileId, View } = props;
  const {
    setFile,
    setFileLoading,
    staleFile,
    setStaleFile,
    file,
    setLastUpdatedBy,
    lastUpdatedBy,
    staleLastUpdatedBy,
  } = useContext(SideBarContext);

  const [acquisitionFile, setAcquisitionFile] = useState<ApiGen_Concepts_AcquisitionFile | null>(
    null,
  );

  const {
    getAcquisitionFile: { execute: retrieveAcquisitionFile, loading: loadingAcquisitionFile },
    getAcquisitionProperties: {
      execute: retrieveAcquisitionFileProperties,
      loading: loadingAcquisitionFileProperties,
    },
    getAcquisitionFileChecklist: { execute: retrieveAcquisitionFileChecklist },
    getLastUpdatedBy: { execute: getLastUpdatedBy, loading: loadingGetLastUpdatedBy },
  } = useAcquisitionProvider();

  const history = useHistory();
  const match = useRouteMatch();

  // Retrieve acquisition file from API and save it to local state and side-bar context
  const fetchAcquisitionFile = useCallback(async () => {
    const retrieved = await retrieveAcquisitionFile(acquisitionFileId);
    if (exists(retrieved)) {
      const acquisitionProperties = await retrieveAcquisitionFileProperties(acquisitionFileId);

      retrieved.fileProperties = acquisitionProperties ?? null;
      setFile({ ...retrieved, fileType: ApiGen_CodeTypes_FileTypes.Acquisition });
      setStaleFile(false);
      setAcquisitionFile(retrieved);
    } else {
      setAcquisitionFile(null);
      setFile(undefined);
    }
  }, [
    acquisitionFileId,
    retrieveAcquisitionFile,
    retrieveAcquisitionFileProperties,
    setFile,
    setStaleFile,
  ]);

  const fetchLastUpdatedBy = React.useCallback(async () => {
    const retrieved = await getLastUpdatedBy(acquisitionFileId);
    if (retrieved !== undefined) {
      setLastUpdatedBy(retrieved);
    } else {
      setLastUpdatedBy(null);
    }
  }, [acquisitionFileId, getLastUpdatedBy, setLastUpdatedBy]);

  // Check lastupdated by
  useEffect(() => {
    if (
      !exists(lastUpdatedBy) ||
      acquisitionFileId !== lastUpdatedBy?.parentId ||
      staleLastUpdatedBy
    ) {
      fetchLastUpdatedBy();
    }
  }, [fetchLastUpdatedBy, lastUpdatedBy, acquisitionFileId, staleLastUpdatedBy]);

  // Check acquisition file
  useEffect(() => {
    if (!exists(acquisitionFile) || staleFile) {
      fetchAcquisitionFile();
    }
  }, [acquisitionFile, fetchAcquisitionFile, staleFile]);

  useEffect(
    () =>
      setFileLoading(
        loadingAcquisitionFile || loadingAcquisitionFileProperties || loadingGetLastUpdatedBy,
      ),
    [
      loadingAcquisitionFile,
      setFileLoading,
      loadingAcquisitionFileProperties,
      loadingGetLastUpdatedBy,
    ],
  );

  const onSelectFileSummary = () => {
    history.push(`${stripTrailingSlash(match.url)}/file`);
  };

  const onSelectProperty = (propertyId: number) => {
    const route = `/property/${propertyId}`;
    history.push(`${stripTrailingSlash(match.url)}${route}`);
  };

  const onEditProperties = () => {
    history.push(`/mapview/sidebar/edit-properties/acquisition/${props.acquisitionFileId}`);
  };

  // UI components
  if (
    loadingAcquisitionFile ||
    loadingAcquisitionFileProperties ||
    file?.fileType !== ApiGen_CodeTypes_FileTypes.Acquisition ||
    file?.id !== acquisitionFileId
  ) {
    return <LoadingBackdrop show={true} parentScreen={true}></LoadingBackdrop>;
  }

  if (!exists(acquisitionFile)) {
    return <></>;
  }
  return (
    <View
      acquisitionFile={acquisitionFile}
      onSelectFileSummary={onSelectFileSummary}
      onSelectProperty={onSelectProperty}
      onEditProperties={onEditProperties}
    />
  );
};

export default AcquisitionFileBodyContainer;
