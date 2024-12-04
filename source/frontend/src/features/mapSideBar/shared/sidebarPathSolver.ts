import { generatePath, useHistory, useRouteMatch } from 'react-router-dom';

import { TabRouteType } from './tabs/RouterTabs';

export interface IPathResolverMethods {
  newFile: (fileType: string) => void;
  showFile: (fileType: string, fileId: number) => void;
  showDetail: (
    fileType: string,
    fileId: number,
    detailType: TabRouteType,
    replace: boolean,
  ) => void;
  editDetails: (fileType: string, fileId: number, detailType: TabRouteType) => void;
  editDetail: (
    fileType: string,
    fileId: number,
    detailType: TabRouteType,
    detailId: number,
  ) => void;
  addDetail: (fileType: string, fileId: number, detailType: TabRouteType) => void;
  editProperties: (fileType: string, fileId: number) => void;
  showPropertyTabs: (fileType: string, fileId: number, propertyId: number) => void;
}

export type IPathResolver = () => IPathResolverMethods;

const usePathResolver: IPathResolver = () => {
  const history = useHistory();
  const match = useRouteMatch<{ fileType: string; fileId: string }>();

  const newFile = (fileType: string) => {
    const a = '/mapview/sidebar/new/:fileType';
    const path = generatePath(a, {
      fileType: fileType,
    });

    history.push(path);
  };

  const showFile = (fileType: string, fileId: number) => {
    const a = '/mapview/sidebar/:fileType/:fileId';
    const path = generatePath(a, {
      fileType: fileType,
      fileId: fileId,
    });

    history.push(path);
  };

  const showDetail = (
    fileType: string,
    fileId: number,
    detailType: TabRouteType,
    replace: boolean,
  ) => {
    const a = '/mapview/sidebar/:fileType/:fileId/file/:detailType';
    const path = generatePath(a, {
      fileType: fileType,
      fileId: fileId,
      detailType: detailType,
    });

    if (replace) {
      history.replace(path);
    } else {
      history.push(path);
    }
  };

  const editDetails = (fileType: string, fileId: number, detailType: TabRouteType) => {
    const a = '/mapview/sidebar/:fileType/:fileId/edit/:detailType';
    const path = generatePath(a, {
      fileType: fileType,
      fileId: fileId,
      detailType: detailType,
    });

    history.push(path);
  };

  const editDetail = (
    fileType: string,
    fileId: number,
    detailType: TabRouteType,
    detailId: number,
  ) => {
    const a = '/mapview/sidebar/:fileType/:fileId/edit/:detailType/:detailId';
    const path = generatePath(a, {
      fileType: fileType,
      fileId: fileId,
      detailType: detailType,
      detailId: detailId,
    });

    history.push(path);
  };

  const addDetail = (fileType: string, fileId: number, detailType: TabRouteType) => {
    const a = '/mapview/sidebar/:fileType/:fileId/edit/:detailType';
    const path = generatePath(a, {
      fileType: fileType,
      fileId: fileId,
      detailType: detailType,
    });

    history.push(path);
  };

  const editProperties = (fileType: string, fileId: number) => {
    const a = '/mapview/sidebar/edit-properties/:fileType/:fileId';
    const path = generatePath(a, {
      fileType: fileType,
      fileId: fileId,
    });

    history.push(path);
  };

  const showPropertyTabs = (fileType: string, fileId: number, propertyId: number) => {
    const a = '/mapview/sidebar/:fileType/:fileId/property/:propertyId';
    const path = generatePath(a, {
      fileType: fileType,
      fileId: fileId,
      propertyId: propertyId,
    });

    history.push(path);
  };

  return {
    newFile,
    showFile,
    showDetail,
    editDetail,
    editDetails,
    addDetail,
    editProperties,
    showPropertyTabs,
  };
};

export default usePathResolver;
