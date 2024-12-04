import { RouteComponentProps } from 'react-router-dom';

import Claims from '@/constants/claims';

export interface NavComponent {
  matcher: string;
  component: (props: RouteComponentProps<any>, onClose: () => void) => React.ReactNode;
  claims: Claims[];
  title: string;
}
