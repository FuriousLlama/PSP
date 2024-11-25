import { generatePath, useHistory, useRouteMatch } from 'react-router-dom';

export interface IPathResolverMethods {
  newFile: (fileType: string) => void;
  showFile: (fileType: string, fileId: number) => void;
  showDetail: (fileType: string, fileId: number, detailType: string) => void;
  editDetails: (fileType: string, fileId: number, detailType: string) => void;
  editDetail: (fileType: string, fileId: number, detailType: string, detailId: number) => void;
  addDetail: (fileType: string, fileId: number, detailType: string) => void;
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

  const showDetail = (fileType: string, fileId: number, detailType: string) => {
    const a = '/mapview/sidebar/:fileType/:fileId/file/:detailType';
    const path = generatePath(a, {
      fileType: fileType,
      fileId: fileId,
      detailType: detailType,
    });

    history.push(path);
  };

  const editDetails = (fileType: string, fileId: number, detailType: string) => {
    const a = '/mapview/sidebar/:fileType/:fileId/edit/:detailType';
    const path = generatePath(a, {
      fileType: fileType,
      fileId: fileId,
      detailType: detailType,
    });

    history.push(path);
  };

  const editDetail = (fileType: string, fileId: number, detailType: string, detailId: number) => {
    const a = '/mapview/sidebar/:fileType/:fileId/edit/:detailType/:detailId';
    const path = generatePath(a, {
      fileType: fileType,
      fileId: fileId,
      detailType: detailType,
      detailId: detailId,
    });

    history.push(path);
  };

  const addDetail = (fileType: string, fileId: number, detailType: string) => {
    const a = '/mapview/sidebar/:fileType/:fileId/add/:detailType';
    const path = generatePath(a, {
      fileType: fileType,
      fileId: fileId,
      detailType: detailType,
    });

    history.push(path);
  };

  return { newFile, showFile, showDetail, editDetail, editDetails, addDetail };
};

export default usePathResolver;
