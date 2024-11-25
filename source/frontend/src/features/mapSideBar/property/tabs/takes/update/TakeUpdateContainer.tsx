import { FormikProps } from 'formik';
import * as React from 'react';
import { useEffect } from 'react';

import { isValidId } from '@/utils/utils';

import { TakeModel } from '../models';
import { useTakesRepository } from '../repositories/useTakesRepository';
import { emptyTake, ITakesFormProps } from './TakeForm';

export interface ITakesDetailContainerProps {
  filePropertyId: number;
  takeId: number;
  View: React.ForwardRefExoticComponent<ITakesFormProps & React.RefAttributes<FormikProps<any>>>;
  onSuccess: () => void;
}

export const TakesUpdateContainer = React.forwardRef<FormikProps<any>, ITakesDetailContainerProps>(
  ({ filePropertyId, takeId, View, onSuccess }, ref) => {
    if (!isValidId(filePropertyId) || !isValidId(+takeId)) {
      throw Error('Unable to edit take with invalid ids');
    }

    const {
      updateTakeByAcquisitionPropertyId: {
        execute: updateTakesByPropertyFile,
        loading: updateTakesLoading,
      },
      getTakeById: { execute: getTakeById, loading: getTakeLoading, response: take },
    } = useTakesRepository();

    useEffect(() => {
      getTakeById(filePropertyId, takeId);
    }, [filePropertyId, takeId, getTakeById]);

    return (
      <View
        onSubmit={async (values, formikHelpers) => {
          formikHelpers.setSubmitting(true);
          try {
            const take = values.toApi();
            await updateTakesByPropertyFile(filePropertyId, take);
            onSuccess();
          } finally {
            formikHelpers.setSubmitting(false);
          }
        }}
        loading={updateTakesLoading || getTakeLoading}
        take={take ? new TakeModel(take) : new TakeModel(emptyTake)}
        ref={ref}
      />
    );
  },
);

export default TakesUpdateContainer;
