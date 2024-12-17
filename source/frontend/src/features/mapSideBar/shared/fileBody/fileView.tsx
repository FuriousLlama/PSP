import MapSideBarLayout from '../../layout/MapSideBarLayout';
import FileBodyRouter from '../router/FileBodyRouter';

interface IFileViewProps {
  title: string;
  icon: React.ReactNode;
  header: React.ReactNode;
}

export const FileView: React.FC<IFileViewProps> = props => {
  const onClose = () => {
    console.log('closing!!!');
  };

  return (
    <MapSideBarLayout
      showCloseButton
      onClose={onClose}
      title={props.title}
      icon={props.icon}
      header={props.header}
    >
      <FileBodyRouter />
    </MapSideBarLayout>
  );
};
