import { FieldArrayRenderProps } from 'formik';
import { FaExternalLinkAlt } from 'react-icons/fa';

import { SectionField } from '@/components/common/Section/SectionField';
import { StyledLink } from '@/components/maps/leaflet/LayerPopup/styles';

import { FormStakeholder } from './models';

export interface ITenantPersonContactInfoProps {
  stakeholder: FormStakeholder;
}

/**
 * Sub-form displaying a person tenant associated to the current lease.
 * @param {ITenantPersonContactInfoProps} param0
 */
export const TenantPersonContactInfo: React.FunctionComponent<
  React.PropsWithChildren<ITenantPersonContactInfoProps & Partial<FieldArrayRenderProps>>
> = ({ stakeholder }) => {
  return (
    <div>
      <SectionField labelWidth="3" label="Person">
        {stakeholder.summary && (
          <>
            <StyledLink to={`/contact/${stakeholder.id}`} target="_blank" rel="noopener noreferrer">
              {stakeholder.summary} <FaExternalLinkAlt />
            </StyledLink>
          </>
        )}
      </SectionField>
    </div>
  );
};

export default TenantPersonContactInfo;
