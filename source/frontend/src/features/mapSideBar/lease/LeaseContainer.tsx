import { FormikProps } from 'formik';
import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import * as Yup from 'yup';

import LeaseIcon from '@/assets/images/lease-icon.svg?react';
import { useLeaseDetail } from '@/features/leases';
import { LeaseFormModel } from '@/features/leases/models';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';

import { SideBarContext } from '../context/sidebarContext';
import MapSideBarLayout from '../layout/MapSideBarLayout';
import LeaseHeader from './common/LeaseHeader';
import { LeaseFileTabNames } from './detail/LeaseFileTabs';
import LeaseBodyRouter from './router/LeaseBodyRouter';

export interface ILeaseContainerProps {
  leaseId: number;
  onClose?: () => void;
}

// Interface for our internal state
export interface LeaseContainerState {
  isEditing: boolean;
  activeEditForm?: LeasePageNames;
  activeTab?: LeaseFileTabNames;
  showConfirmModal: boolean;
}

const initialState: LeaseContainerState = {
  isEditing: false,
  activeEditForm: undefined,
  activeTab: undefined,
  showConfirmModal: false,
};

export interface LeasePageProps<T> {
  isEditing: boolean;
  onEdit?: (isEditing: boolean) => void;
  formikRef: React.RefObject<FormikProps<LeaseFormModel>>;
  onSuccess: () => void;
  refreshLease?: () => void;
  componentView: React.FunctionComponent<React.PropsWithChildren<T>>;
}

export interface ILeasePage<T> {
  pageName: LeasePageNames;
  component: React.FunctionComponent<React.PropsWithChildren<LeasePageProps<T>>>;
  componentView?: React.FunctionComponent<React.PropsWithChildren<T>>;
  title: string;
  description?: string;
  validation?: Yup.ObjectSchema<any>;
  claims?: string[] | string;
  editable?: boolean;
}

export enum LeasePageNames {
  DETAILS = 'details',
  TENANT = 'tenant',
  EDIT_TENANT = 'edit-tenant',
  PAYEE = 'payee',
  EDIT_PAYEE = 'edit-payee',
  PAYMENTS = 'payments',
  IMPROVEMENTS = 'improvements',
  INSURANCE = 'insurance',
  DEPOSIT = 'deposit',
  SURPLUS = 'surplus',
  CHECKLIST = 'checklist',
  DOCUMENTS = 'documents',
  CONSULTATIONS = 'consultations',
}

export const LeaseContainer: React.FC<ILeaseContainerProps> = ({ leaseId, onClose }) => {
  // keep track of our internal container state
  const [containerState, setContainerState] = useReducer(
    (prevState: LeaseContainerState, newState: Partial<LeaseContainerState>) => ({
      ...prevState,
      ...newState,
    }),
    initialState,
  );

  const formikRef = useRef<FormikProps<LeaseFormModel>>(null);

  const close = useCallback(() => onClose && onClose(), [onClose]);
  const { lease, setLease, refresh, loading } = useLeaseDetail(leaseId);
  const {
    setStaleFile,
    staleFile,
    setStaleLastUpdatedBy,
    setLastUpdatedBy,
    staleLastUpdatedBy,
    lastUpdatedBy,
  } = useContext(SideBarContext);

  const [isValid, setIsValid] = useState<boolean>(true);

  const {
    getLastUpdatedBy: { execute: getLastUpdatedBy, loading: getLastUpdatedByLoading },
  } = useLeaseRepository();

  const onChildSuccess = useCallback(() => {
    setStaleLastUpdatedBy(true);
  }, [setStaleLastUpdatedBy]);

  const handleCancelConfirm = () => {
    if (formikRef !== undefined) {
      formikRef.current?.resetForm();
    }
    setIsValid(true);
    setContainerState({
      showConfirmModal: false,
      isEditing: false,
      activeEditForm: undefined,
    });
  };

  const handleSaveClick = async () => {
    await formikRef?.current?.validateForm();
    if (!formikRef?.current?.isValid) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }

    if (formikRef !== undefined) {
      formikRef.current?.setSubmitting(true);
      formikRef.current?.submitForm();
    }
  };

  const handleCancelClick = () => {
    if (formikRef !== undefined) {
      if (formikRef.current?.dirty) {
        setContainerState({ showConfirmModal: true });
      } else {
        handleCancelConfirm();
      }
    } else {
      handleCancelConfirm();
    }
  };

  const fetchLastUpdatedBy = useCallback(async () => {
    if (leaseId) {
      const retrieved = await getLastUpdatedBy(leaseId);
      if (retrieved !== undefined) {
        setLastUpdatedBy(retrieved);
      } else {
        setLastUpdatedBy(null);
      }
    }
  }, [leaseId, getLastUpdatedBy, setLastUpdatedBy]);

  useEffect(() => {
    const refreshLease = async () => {
      await refresh();
    };

    if (staleFile) {
      refreshLease();
      setStaleFile(false);
    }
  }, [staleFile, refresh, setStaleFile]);

  useEffect(() => {
    if (lastUpdatedBy === undefined || leaseId !== lastUpdatedBy?.parentId || staleLastUpdatedBy) {
      fetchLastUpdatedBy();
    }
  }, [fetchLastUpdatedBy, lastUpdatedBy, leaseId, staleLastUpdatedBy]);

  return (
    <MapSideBarLayout
      showCloseButton
      onClose={close}
      title={containerState.isEditing ? 'Update Lease / Licence' : 'Lease / Licence'}
      icon={
        <LeaseIcon
          title="Lease file icon"
          width="2.6rem"
          height="2.6rem"
          fill="currentColor"
          className="mr-2"
        />
      }
      header={<LeaseHeader lease={lease} lastUpdatedBy={lastUpdatedBy} />}
    >
      <LeaseBodyRouter />
    </MapSideBarLayout>
  );
};

export default LeaseContainer;
