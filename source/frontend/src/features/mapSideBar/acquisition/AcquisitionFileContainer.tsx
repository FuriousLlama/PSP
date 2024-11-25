import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { matchPath, useHistory, useLocation, useRouteMatch } from 'react-router-dom';

import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { useAcquisitionProvider } from '@/hooks/repositories/useAcquisitionProvider';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { ApiGen_Concepts_AcquisitionFile } from '@/models/api/generated/ApiGen_Concepts_AcquisitionFile';
import { exists, stripTrailingSlash } from '@/utils';

import { SideBarContext } from '../context/sidebarContext';
import { IAcquisitionFileViewProps } from './AcquisitionFileView';

export interface IAcquisitionFileContainerProps {
  acquisitionFileId: number;
  onClose: () => void;
  View: React.FunctionComponent<React.PropsWithChildren<IAcquisitionFileViewProps>>;
}

export const AcquisitionFileContainer: React.FunctionComponent<
  IAcquisitionFileContainerProps
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

  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const isPropertySelector = useMemo(
    () =>
      matchPath<Record<string, string>>(
        location.pathname,
        `${stripTrailingSlash(match.path)}/property/selector`,
      ),
    [location.pathname, match.path],
  );

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

  // UI components
  if (
    loadingAcquisitionFile ||
    (loadingAcquisitionFileProperties && !isPropertySelector) ||
    file?.fileType !== ApiGen_CodeTypes_FileTypes.Acquisition ||
    file?.id !== acquisitionFileId
  ) {
    return <LoadingBackdrop show={true} parentScreen={true} />;
  }

  if (!exists(acquisitionFile)) {
    return <></>;
  }
  return (
    <View
      acquisitionFile={acquisitionFile}
      lastUpdatedBy={lastUpdatedBy}
      onClose={props.onClose}
      formTitle="Acquisition File"
    />
  );
};

export default AcquisitionFileContainer;
