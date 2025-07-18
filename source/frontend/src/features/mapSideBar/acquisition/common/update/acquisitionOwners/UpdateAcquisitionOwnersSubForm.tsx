import { FieldArray, useFormikContext } from 'formik';
import { useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import styled from 'styled-components';

import { LinkButton, RemoveButton } from '@/components/common/buttons';
import { Input } from '@/components/common/form';
import { RadioGroup } from '@/components/common/form/RadioGroup';
import { SectionField } from '@/components/common/Section/SectionField';
import { H3 } from '@/components/common/styles';
import Address from '@/features/contacts/contact/create/components/address/Address';

import { TeamMemberFormModal } from '../../modals/AcquisitionFormModal';
import {
  AcquisitionOwnerFormModel,
  OwnerAddressFormModel,
  WithAcquisitionOwners,
} from '../../models';

const UpdateAcquisitionOwnersSubForm: React.FC<{ isSubFile?: boolean }> = ({
  isSubFile = false,
}) => {
  const { values, setFieldValue, handleChange } = useFormikContext<WithAcquisitionOwners>();
  const [removeIndex, setRemoveIndex] = useState<number>(-1);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);

  const updatePrimaryContacts = (newPrimaryIndex: number) => {
    if (values.owners.length > 1) {
      for (let i = 0; i < values.owners.length; i++) {
        if (i !== newPrimaryIndex) {
          setFieldValue(`owners[${i}].isPrimaryContact`, '');
        }
      }
    }
  };

  const onPrimaryContactUpdated = (updateFunction: () => void) => {
    return (e: React.ChangeEvent<any>) => {
      updateFunction();
      handleChange(e);
    };
  };

  const onRemovedPrimaryContact = (index: number) => {
    if (values.owners.length > 1) {
      const isPrimary = values.owners[index].isPrimaryContact === 'true';
      if (isPrimary) {
        if (index === 0) {
          values.owners[++index].isPrimaryContact = 'true';
        } else {
          values.owners[0].isPrimaryContact = 'true';
        }
      }
    }
  };

  return (
    <FieldArray
      name="owners"
      render={arrayHelpers => (
        <>
          {values.owners.map((owner, index) => (
            <Row key={`owner-parent-${index}`} className="py-3">
              <Container>
                <ButtonDiv>
                  <RemoveButton
                    label={isSubFile ? 'Remove Sub-interest' : 'Remove Owner'}
                    data-testId={`owners[${index}]-remove-button`}
                    onRemove={() => {
                      setRemoveIndex(index);
                      setShowRemoveModal(true);
                    }}
                  >
                    Remove Owner
                  </RemoveButton>
                </ButtonDiv>
                <SectionField
                  label={
                    isSubFile
                      ? 'Is this sub-interest an individual / corporation ?'
                      : 'Is this owner an individual / corporation ?'
                  }
                >
                  <RadioGroup
                    field={`owners[${index}].isOrganization`}
                    flexDirection="row"
                    radioValues={[
                      {
                        radioValue: 'false',
                        radioLabel: 'Individual',
                      },
                      {
                        radioValue: 'true',
                        radioLabel: 'Corporation',
                      },
                    ]}
                  />
                </SectionField>
                <H3>Name</H3>

                <StyledRadioWrap>
                  <SectionField label={null}>
                    <RadioGroup
                      field={`owners[${index}].isPrimaryContact`}
                      flexDirection="row"
                      handleChange={onPrimaryContactUpdated(() => {
                        updatePrimaryContacts(index);
                        setFieldValue(`owners[${index}].isPrimaryContact`, 'true');
                      })}
                      radioValues={[
                        {
                          radioValue: 'true',
                          radioLabel: 'Primary Contact',
                        },
                      ]}
                    />
                  </SectionField>
                </StyledRadioWrap>

                {owner.isOrganization === 'false' && (
                  <SectionField label="Given names">
                    <Input
                      field={`owners[${index}].givenName`}
                      placeholder="First name Middle name (individuals only)"
                    />
                  </SectionField>
                )}
                <SectionField
                  label={owner.isOrganization === 'true' ? 'Corporation name ' : 'Last name'}
                >
                  <Input
                    field={`owners[${index}].lastNameAndCorpName`}
                    placeholder={
                      owner.isOrganization === 'true'
                        ? "Business' legal name"
                        : "Individual's last name"
                    }
                  />
                </SectionField>
                <SectionField
                  label="Other name"
                  tooltip="Additional name for Individual (ex: alias or maiden name or space for long last name) Corporation (ex: Doing business as)"
                >
                  <Input
                    field={`owners[${index}].otherName`}
                    placeholder="Alias/Doing business as etc."
                  />
                </SectionField>

                {owner.isOrganization === 'true' && (
                  <SectionField label="Incorporation number">
                    <Input
                      field={`owners[${index}].incorporationNumber`}
                      placeholder="Incorporation #"
                    />
                  </SectionField>
                )}

                {owner.isOrganization === 'true' && (
                  <SectionField
                    label="Registration number"
                    tooltip="The number used for tax purposes, (like GST)"
                  >
                    <Input
                      field={`owners[${index}].registrationNumber`}
                      placeholder="If no Incorporation #"
                    />
                  </SectionField>
                )}

                <StyledDiv>
                  <H3>Mailing Address</H3>
                  <Address
                    namespace={`owners[${index}].address`}
                    addressLines={OwnerAddressFormModel.addressLines(owner.address)}
                  />
                </StyledDiv>

                <H3>Contact Information</H3>
                <SectionField label="Email">
                  <Input field={`owners[${index}].contactEmailAddress`} />
                </SectionField>

                <SectionField label="Phone">
                  <Input field={`owners[${index}].contactPhoneNumber`} />
                </SectionField>
                {index < values.owners.length - 1 && <hr></hr>}
              </Container>
            </Row>
          ))}
          <LinkButton
            data-testid="add-file-owner"
            onClick={() => {
              const owner = new AcquisitionOwnerFormModel();
              if (values.owners.length === 0) {
                owner.isPrimaryContact = 'true';
              }
              arrayHelpers.push(owner);
            }}
          >
            {isSubFile ? '+ Add Sub-interest' : '+ Add owner'}
          </LinkButton>

          <TeamMemberFormModal
            message={
              isSubFile
                ? 'Are you sure you want to remove this Sub-interest?'
                : 'Are you sure you want to remove this Owner?'
            }
            title={isSubFile ? 'Remove Sub-interest' : 'Remove Owner'}
            display={showRemoveModal}
            handleOk={() => {
              onRemovedPrimaryContact(removeIndex);
              setShowRemoveModal(false);
              arrayHelpers.remove(removeIndex);
              setRemoveIndex(-1);
            }}
            handleCancel={() => {
              setShowRemoveModal(false);
              setRemoveIndex(-1);
            }}
          ></TeamMemberFormModal>
        </>
      )}
    ></FieldArray>
  );
};

export default UpdateAcquisitionOwnersSubForm;

export const StyledDiv = styled.div`
  background-color: none;
`;

export const StyledRadioWrap = styled.div`
  margin: 1.5rem;
`;

export const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
`;
