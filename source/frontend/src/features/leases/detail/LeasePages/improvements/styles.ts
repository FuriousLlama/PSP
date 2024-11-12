import styled from 'styled-components';

import { FormDescriptionLabel } from '@/features/leases/detail/styles';

// common ui styling
export * from '@/features/leases/detail/styles';

export const ImprovementsListHeader = styled(FormDescriptionLabel)`
  color: ${props => props.theme.css.headerTextColor};
  font-size: 1.8rem;
  margin-bottom: 2rem;
`;
