import { FieldArray, Formik, FormikProps } from 'formik';
import orderBy from 'lodash/orderBy';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { Form } from '@/components/common/form/Form';
import { Section } from '@/components/common/Section/Section';
import { SectionField } from '@/components/common/Section/SectionField';
import { StyledSummarySection } from '@/components/common/Section/SectionStyles';
import { INSURANCE_TYPES } from '@/constants/API';
import SidebarFooter from '@/features/mapSideBar/shared/SidebarFooter';
import usePathResolver from '@/features/mapSideBar/shared/sidebarPathSolver';
import { TabRouteType } from '@/features/mapSideBar/shared/tabs/RouterTabs';
import { useInsurancesRepository } from '@/hooks/repositories/useInsuranceRepository';
import useLookupCodeHelpers from '@/hooks/useLookupCodeHelpers';
import { ApiGen_Concepts_Insurance } from '@/models/api/generated/ApiGen_Concepts_Insurance';
import { ILookupCode } from '@/store/slices/lookupCodes/interfaces';
import { withNameSpace } from '@/utils/formUtils';
import { exists, isValidId } from '@/utils/utils';

import InsuranceForm from './InsuranceForm';
import { InsuranceYupSchema } from './InsuranceYupSchema';
import { FormInsurance, IUpdateFormInsurance } from './models';

export interface InsuranceEditContainerProps {
  leaseId: number;
}

const InsuranceEditContainer: React.FunctionComponent<
  React.PropsWithChildren<InsuranceEditContainerProps>
> = ({ leaseId }) => {
  const {
    getInsurances: { execute: getInsurances, loading, response: insurances },
    updateInsurances: { execute: updateInsurances },
  } = useInsurancesRepository();

  useEffect(() => {
    getInsurances(leaseId);
  }, [getInsurances, leaseId]);

  const formikRef = useRef<FormikProps<IUpdateFormInsurance>>(null);
  const lookupCodes = useLookupCodeHelpers();

  const insuranceTypes = lookupCodes.getByType(INSURANCE_TYPES).sort((a, b) => {
    return (a.displayOrder || 0) - (b.displayOrder || 0);
  });

  const initialInsurances = useMemo(
    () =>
      insuranceTypes.map<FormInsurance>(x => {
        const foundInsurance = insurances?.find(i => i.insuranceType?.id === x.id);
        if (foundInsurance) {
          return FormInsurance.createFromModel(foundInsurance);
        } else {
          return FormInsurance.createEmpty(x, leaseId);
        }
      }),
    [insuranceTypes, insurances, leaseId],
  );

  const handleOnChange = (e: any, codeType: ILookupCode, arrayHelpers: any) => {
    if (formikRef.current) {
      const found = initialInsurances.findIndex(x => x.insuranceType?.id === codeType.id);

      if (e.target.checked) {
        arrayHelpers.push(codeType.id.toString());
        formikRef.current.values.insurances[found].isShown = true;
      } else {
        const idx = formikRef.current?.values.visibleTypes.indexOf(codeType.id.toString());
        arrayHelpers.remove(idx);
        formikRef.current.values.insurances[found].isShown = false;
      }
    }
  };

  const pathResolver = usePathResolver();

  const onSuccess = useCallback(() => {
    pathResolver.showDetail('lease', leaseId, TabRouteType.insurance, true);
  }, [leaseId, pathResolver]);

  const onClose = () => {
    pathResolver.showDetail('lease', leaseId, TabRouteType.insurance, true);
  };

  const onSave = useCallback(
    async (insurances: ApiGen_Concepts_Insurance[]) => {
      if (isValidId(leaseId)) {
        const updatedInsurance = await updateInsurances(leaseId, insurances);
        if (updatedInsurance) {
          leaseId && (await getInsurances(leaseId));
          onSuccess();
        }
      }
    },
    [getInsurances, leaseId, updateInsurances, onSuccess],
  );

  const insuranceList = orderBy(insurances, i => i.insuranceType?.displayOrder) ?? [];
  const initialTypes = insuranceList.map(x => x?.insuranceType?.id).filter(exists);

  const initialValues: IUpdateFormInsurance = {
    insurances: initialInsurances,
    visibleTypes: initialTypes,
  };

  return (
    <Formik<IUpdateFormInsurance>
      initialValues={initialValues}
      validationSchema={InsuranceYupSchema}
      enableReinitialize
      onSubmit={(values: IUpdateFormInsurance) => {
        return onSave(
          values.insurances
            .filter(i => i.isShown)
            .map<ApiGen_Concepts_Insurance>(x => x.toInterfaceModel()),
        );
      }}
      innerRef={formikRef}
    >
      {formikProps => (
        <>
          <StyledSummarySection>
            <Section header="Required Coverage">
              <SectionField label="Select coverage types">
                <FieldArray
                  name={withNameSpace('visibleTypes')}
                  render={arrayHelpers => (
                    <Form.Group>
                      {insuranceTypes.map((code: ILookupCode, index: number) => (
                        <Form.Check
                          id={`insurance-checkbox-${index}`}
                          type="checkbox"
                          name="checkedTypes"
                          key={`${index}-${code.id}`}
                        >
                          <Form.Check.Input
                            id={`insurance-${index}`}
                            data-testid="insurance-checkbox"
                            type="checkbox"
                            name="checkedTypes"
                            value={code.id.toString()}
                            checked={formikProps.values.visibleTypes.includes(code.id.toString())}
                            onChange={(e: any) => {
                              handleOnChange(e, code, arrayHelpers);
                            }}
                          />
                          <Form.Check.Label htmlFor={`insurance-${index}`}>
                            {code.name}
                          </Form.Check.Label>
                        </Form.Check>
                      ))}
                    </Form.Group>
                  )}
                />
              </SectionField>
            </Section>

            <FieldArray
              name={withNameSpace('insurances')}
              render={() => (
                <>
                  {formikProps.values.insurances.map(
                    (insurance: FormInsurance, index: number) =>
                      insurance.isShown && (
                        <InsuranceForm
                          nameSpace={withNameSpace(`insurances.${index}`)}
                          key={`insurances.${index}`}
                        />
                      ),
                  )}
                </>
              )}
            />
          </StyledSummarySection>
          <SidebarFooter
            isOkDisabled={formikProps?.isSubmitting}
            onSave={formikProps.submitForm}
            onCancel={onClose}
            displayRequiredFieldError={!formikProps.isValid && !!formikProps.submitCount}
          />
        </>
      )}
    </Formik>
  );
};

export default InsuranceEditContainer;
