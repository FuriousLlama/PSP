import { Formik } from 'formik';
import noop from 'lodash/noop';
import { useState } from 'react';

import GenericModal from '@/components/common/GenericModal';
import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { LeaseFormModel } from '@/features/leases/models';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { ApiGen_Concepts_SecurityDeposit } from '@/models/api/generated/ApiGen_Concepts_SecurityDeposit';
import { ApiGen_Concepts_SecurityDepositReturn } from '@/models/api/generated/ApiGen_Concepts_SecurityDepositReturn';

import DepositNotes from './components/DepositNotes/DepositNotes';
import DepositsReceivedContainer from './components/DepositsReceivedContainer/DepositsReceivedContainer';
import DepositsReturnedContainer from './components/DepositsReturnedContainer/DepositsReturnedContainer';
import ReceivedDepositModal from './modal/receivedDepositModal/ReceivedDepositModal';
import ReturnedDepositModal from './modal/returnedDepositModal/ReturnedDepositModal';
import { FormLeaseDeposit } from './models/FormLeaseDeposit';
import { LeaseDepositForm } from './models/LeaseDepositForm';
import * as Styled from './styles';

export interface IDepositsViewProps {
  lease: ApiGen_Concepts_Lease;
  isLoading: boolean;
  securityDeposits: ApiGen_Concepts_SecurityDeposit[];
  depositReturns: ApiGen_Concepts_SecurityDepositReturn[];

  showDepositEditModal: boolean;
  deleteModalWarning: boolean;
  deleteReturnModalWarning: boolean;
  showReturnEditModal: boolean;

  onAddDeposit: () => void;
  onEditDeposit: (id: number) => void;
  onDeleteDeposit: (id: number) => void;
  onReturnDeposit: (id: number) => void;
  onEditReturnDeposit: (id: number) => void;
  onDeleteDepositReturn: (id: number) => void;
}

export const DepositsContainer: React.FunctionComponent<
  React.PropsWithChildren<IDepositsViewProps>
> = ({
  isLoading,
  lease,
  securityDeposits,
  depositReturns,
  deleteModalWarning,
  deleteReturnModalWarning,
  onEditReturnDeposit,
  onDeleteDepositReturn,
}) => {
  const [showDepositEditModal, setShowEditModal] = useState<boolean>(false);
  const [editNotes, setEditNotes] = useState<boolean>(false);
  const [depositToDelete, setDepositToDelete] = useState<FormLeaseDeposit | undefined>(undefined);
  const [editDepositValue, setEditDepositValue] = useState<FormLeaseDeposit>(
    FormLeaseDeposit.createEmpty(lease?.id ?? 0),
  );

  const onAddDeposit = () => {
    lease?.id && setEditDepositValue(FormLeaseDeposit.createEmpty(lease?.id));
    setShowEditModal(true);
  };

  const onEditDeposit = (id: number) => {
    const deposit = securityDeposits.find((x: ApiGen_Concepts_SecurityDeposit) => x.id === id);
    if (deposit) {
      setEditDepositValue(FormLeaseDeposit.fromApi(deposit));
      setShowEditModal(true);
    }
  };

  const onDeleteDeposit = (id: number) => {
    const deposit = securityDeposits.find((x: ApiGen_Concepts_SecurityDeposit) => x.id === id);
    if (deposit) {
      setDepositToDelete(FormLeaseDeposit.fromApi(deposit));
      setDeleteModalWarning(true);
    }
  };

  const onReturnDeposit = (id: number) => {
    const deposit = securityDeposits.find((x: ApiGen_Concepts_SecurityDeposit) => x.id === id);
    if (deposit) {
      setEditReturnValue(FormLeaseDepositReturn.createEmpty(deposit));
      setShowReturnEditModal(true);
    }
  };

  const initialValues = LeaseFormModel.fromApi(lease);

  return (
    <>
      <LoadingBackdrop show={isLoading} parentScreen />

      <Formik initialValues={{ ...new LeaseDepositForm(), ...initialValues }} onSubmit={noop}>
        {formikProps => (
          <Styled.DepositsContainer>
            <DepositsReceivedContainer
              securityDeposits={securityDeposits}
              onAdd={onAddDeposit}
              onEdit={onEditDeposit}
              onDelete={onDeleteDeposit}
              onReturn={onReturnDeposit}
            />

            <DepositsReturnedContainer
              securityDeposits={securityDeposits}
              depositReturns={depositReturns}
              onEdit={onEditReturnDeposit}
              onDelete={onDeleteDepositReturn}
            />

            <DepositNotes
              disabled={!editNotes}
              onEdit={() => setEditNotes(true)}
              onSave={async (notes: string) => {
                lease?.id && (await updateSecurityDepositNote(lease.id, notes));
                setEditNotes(false);
                props.onSuccess();
              }}
              onCancel={() => {
                setEditNotes(false);
                formikProps.setFieldValue('returnNotes', lease?.returnNotes ?? '');
              }}
            />

            <GenericModal
              variant="warning"
              display={deleteModalWarning}
              title="Delete Deposit"
              message={`Are you sure you want to remove the deposit?`}
              handleOk={() => onDeleteDepositConfirmed()}
              okButtonText="OK"
              setDisplay={setDeleteModalWarning}
            />
            <GenericModal
              variant="warning"
              display={deleteReturnModalWarning}
              title="Delete Deposit Return"
              message={`Are you sure you want to remove this deposit return?`}
              handleOk={() => onDeleteDepositReturnConfirmed()}
              okButtonText="OK"
              setDisplay={setDeleteReturnModalWarning}
            />

            <ReceivedDepositModal
              display={showDepositEditModal}
              initialValues={editDepositValue}
              onCancel={() => {
                lease?.id && setEditDepositValue(FormLeaseDeposit.createEmpty(lease.id));
                setShowEditModal(false);
              }}
              onSave={onSaveDeposit}
            />

            <ReturnedDepositModal
              display={showReturnEditModal}
              initialValues={editReturnValue}
              onCancel={() => {
                setEditReturnValue(undefined);
                setShowReturnEditModal(false);
              }}
              onSave={onSaveReturnDeposit}
            />
          </Styled.DepositsContainer>
        )}
      </Formik>
    </>
  );
};
