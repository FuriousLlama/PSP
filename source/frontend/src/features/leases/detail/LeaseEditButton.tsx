import { FaEdit } from 'react-icons/fa';

import { LinkButton } from '@/components/common/buttons';
import { ProtectedComponent } from '@/components/common/ProtectedComponent';
import { Claims } from '@/constants/claims';

interface ILeaseEditButtonProps {
  onEdit?: () => void;
}

export const LeaseEditButton: React.FunctionComponent<
  React.PropsWithChildren<ILeaseEditButtonProps>
> = ({ onEdit }) => {
  return (
    <ProtectedComponent hideIfNotAuthorized claims={[Claims.LEASE_EDIT]}>
      {!!onEdit && (
        <LinkButton onClick={onEdit} className="float-right">
          <FaEdit size={'2rem'} />
        </LinkButton>
      )}
    </ProtectedComponent>
  );
};

export default LeaseEditButton;
