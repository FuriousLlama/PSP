import { IPathResolver } from './sidebarPathSolver';

export interface TabInteractiveContainerProps<T> {
  fileId: number;
  pathResolverHook: IPathResolver;
  onSuccess: () => void;
  View: React.FunctionComponent<React.PropsWithChildren<T>> | null;
}
