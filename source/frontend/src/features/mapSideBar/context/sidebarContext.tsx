import { findIndex } from 'lodash';
import { createContext, useCallback, useEffect, useState } from 'react';

import { useMapStateMachine } from '@/components/common/mapFSM/MapStateMachineContext';
import { Api_LastUpdatedBy } from '@/models/api/File';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { ApiGen_Concepts_File } from '@/models/api/generated/ApiGen_Concepts_File';
import { ApiGen_Concepts_FileProperty } from '@/models/api/generated/ApiGen_Concepts_FileProperty';
import { ApiGen_Concepts_Project } from '@/models/api/generated/ApiGen_Concepts_Project';
import { exists } from '@/utils';
import { getLatLng, locationFromFileProperty } from '@/utils/mapPropertyUtils';

import { IFileBodyContainer } from '../lease/LeaseBodyContainer';
import { NavComponent } from '../shared/router/navComponent';
import { TabContent } from '../shared/tabs/RouterTabs';

export interface TypedFile extends ApiGen_Concepts_File {
  fileType: ApiGen_CodeTypes_FileTypes;
  projectId?: number | null; // TODO: If all files have project/product then the backend should match the typing
  productId?: number | null;
}

export interface FileComponents {
  defaultFileTab: string;
  propertyTabs: TabContent[];
  defaultPropertyTab: string;
  editNavComponents: NavComponent[];
  fileBodyContainer: React.FunctionComponent<IFileBodyContainer>;
}

export interface ISideBarContext {
  staleFile: boolean;
  setStaleFile: (stale: boolean) => void;

  fileLoading: boolean;
  setFileLoading: (loading: boolean) => void;
  resetFilePropertyLocations: () => void;
  projectLoading: boolean;
  project?: ApiGen_Concepts_Project;
  setProject: (project?: ApiGen_Concepts_Project) => void;
  setProjectLoading: (loading: boolean) => void;
  getFilePropertyIndexById: (filePropertyId: number) => number;

  lastUpdatedBy: Api_LastUpdatedBy | null;
  setLastUpdatedBy: (lastUpdatedBy: Api_LastUpdatedBy | null) => void;
  staleLastUpdatedBy: boolean;
  setStaleLastUpdatedBy: (stale: boolean) => void;

  fileType: string;
  fileComponents: FileComponents;

  setFileComponents: (fileType: string, components: FileComponents) => void;
  clearFileData: () => void;
}

export const SideBarContext = createContext<ISideBarContext>({
  clearFileData: () => {
    throw Error('clearFileData function not defined');
  },
  fileType: 'NOT_DEFINED',
  fileLoading: false,
  setFileLoading: () => {
    throw Error('setFileLoading function not defined');
  },

  resetFilePropertyLocations: () => {
    throw Error('resetFilePropertyLocations function not defined');
  },
  staleFile: false,
  setStaleFile: () => {
    throw Error('setStaleFile function not defined');
  },
  getFilePropertyIndexById: () => {
    throw Error('setStaleFile function not defined');
  },
  setProject: () => {
    throw Error('setProject function not defined');
  },
  projectLoading: false,
  setProjectLoading: () => {
    throw Error('setProjectLoading function not defined');
  },
  lastUpdatedBy: null,
  setLastUpdatedBy: () => {
    throw Error('setLastUpdatedBy function not defined');
  },
  staleLastUpdatedBy: false,
  setStaleLastUpdatedBy: () => {
    throw Error('setStaleLastUpdatedBy function not defined');
  },

  fileComponents: null,
  setFileComponents: () => {
    throw Error('setFileComponents function not defined');
  },
});

export const SideBarContextProvider = (props: {
  children: React.ReactChild | React.ReactChild[] | React.ReactNode;
  file?: TypedFile;
  project?: ApiGen_Concepts_Project;
  lastUpdatedBy?: Api_LastUpdatedBy;
}) => {
  const [project, setProject] = useState<ApiGen_Concepts_Project | undefined>(props.project);
  const [staleFile, setStaleFile] = useState<boolean>(false);
  const [lastUpdatedBy, setLastUpdatedBy] = useState<Api_LastUpdatedBy | null>(
    props.lastUpdatedBy ?? null,
  );
  const [staleLastUpdatedBy, setStaleLastUpdatedBy] = useState<boolean>(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [projectLoading, setProjectLoading] = useState<boolean>(false);

  const [fileType, setFileType] = useState<string>('NOT_DEFINED');
  const [fileProperties, setFileProperties] = useState<ApiGen_Concepts_FileProperty[]>([]);

  const [fileComponents, setFileComponents] = useState<FileComponents>();

  const [fileTabs, setFileTabs] = useState<TabContent[]>([]);

  const clearFileData = useCallback(() => {
    setFileType(null);
    setFileProperties(null);
    setFileComponents(null);

    setStaleFile(false);
  }, []);

  const setComponents = useCallback((fileType: string, components: FileComponents) => {
    //setFileType(fileType);
    debugger;
    setFileComponents(components);
    setStaleFile(false);
  }, []);

  const setLastUpdatedByAndStale = useCallback(
    (lastUpdatedBy: Api_LastUpdatedBy | null) => {
      setLastUpdatedBy(lastUpdatedBy);
      setStaleLastUpdatedBy(false);
    },
    [setLastUpdatedBy, setStaleLastUpdatedBy],
  );

  const setProjectInstance = useCallback(
    (project?: ApiGen_Concepts_Project) => {
      setProject(project);
    },
    [setProject],
  );

  const getFilePropertyIndexById = (filePropertyId: number) =>
    findIndex(fileProperties, fp => fp.id === filePropertyId);

  const { setFilePropertyLocations } = useMapStateMachine();

  const resetFilePropertyLocations = useCallback(() => {
    if (exists(fileProperties)) {
      const propertyLocations = fileProperties
        .map(x => locationFromFileProperty(x))
        .map(y => getLatLng(y))
        .filter(exists);

      setFilePropertyLocations && setFilePropertyLocations(propertyLocations);
    } else {
      setFilePropertyLocations && setFilePropertyLocations([]);
    }
  }, [fileProperties, setFilePropertyLocations]);

  // Automatically render "draft" property markers when opening a PIMS file.
  useEffect(() => {
    resetFilePropertyLocations();
  }, [resetFilePropertyLocations]);

  useEffect(() => {
    if (staleLastUpdatedBy) {
      setLastUpdatedByAndStale(lastUpdatedBy);
    }
  }, [lastUpdatedBy, setLastUpdatedByAndStale, staleLastUpdatedBy]);

  return (
    <SideBarContext.Provider
      value={{
        setFileLoading: setFileLoading,
        fileLoading: fileLoading,
        resetFilePropertyLocations,
        staleFile,
        setStaleFile,
        getFilePropertyIndexById,
        projectLoading,
        setProject: setProjectInstance,
        setProjectLoading: setProjectLoading,
        project: project,
        lastUpdatedBy,
        setLastUpdatedBy: setLastUpdatedByAndStale,
        staleLastUpdatedBy,
        setStaleLastUpdatedBy,

        clearFileData: clearFileData,
        fileType: fileType,

        fileComponents: fileComponents,
        setFileComponents: setComponents,
      }}
    >
      {props.children}
    </SideBarContext.Provider>
  );
};
