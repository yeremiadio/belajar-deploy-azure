import { ColumnDef, Row } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineArrowDownward,
  MdOutlineArrowUpward,
  MdOutlineEdit,
} from 'react-icons/md';

import Modal from '@/components/Modal';
import Spinner from '@/components/Spinner';
import TableBackendPagination from '@/components/Table/BaseTable/_components/TableBackendPagination';
import { ExpansionTable } from '@/components/Table/ExpansionTable';
import { Button } from '@/components/ui/button';
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { useToast } from '@/components/ui/use-toast';

import {
  useDeleteInventoryTransactionMutation,
  useGetInventoryTransactionQuery,
} from '@/stores/managementStore/inventoryStore';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { TInventoryTransaction } from '@/types/api/inventory';
import { IInventory } from '@/types/api/management/inventory';

import filterObjectIfValueIsEmpty from '@/utils/functions/filterObjectIfValueIsEmpty';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import useBackendPaginationController from '@/utils/hooks/useBackendPaginationController';
import { useModal } from '@/utils/hooks/useModal';

type Props = {
  inventoryData: Row<IInventory>;
  toggleTransactionForm: (open?: boolean) => void;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<TInventoryTransaction | undefined>
  >;
};

const InventoryTransactionTable: FC<Props> = ({
  inventoryData,
  toggleTransactionForm,
  setSelectedTransaction,
}) => {
  const [selectedDeleteTransaction, setSelectedDeleteTransaction] =
    useState<TInventoryTransaction>();

  const { isShown: isShownDelete, toggle: toggleDelete } = useModal();

  const { page, setPage, take, setLimit } = useBackendPaginationController(
    filterObjectIfValueIsEmpty({
      defaultPage: 1,
      defaultTake: 10,
    }),
  );

  const { data: transactionData, isLoading: isLoadingTransaction } =
    useGetInventoryTransactionQuery({
      id: inventoryData?.original?.id?.toString(),
      page,
      take,
    });

  const [deleteTransactionData, { isLoading: isDeleting }] =
    useDeleteInventoryTransactionMutation();

  const handleDeleteTransaction = async () => {
    if (!selectedDeleteTransaction?.id || !inventoryData?.original?.id) return;

    deleteTransactionData({
      id: inventoryData?.original?.id,
      inventoryTransactionId: selectedDeleteTransaction?.id,
    })
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'Transaction deleted successfully',
            variant: 'success',
          }),
        );
      })
      .catch((error: ErrorMessageBackendDataShape) => {
        const { title, message } = generateStatusCodesMessage(error.status);
        toast(
          generateDynamicToastMessage({
            title,
            description: `${message} "\n${error?.data?.message ?? ''}"`,
            variant: 'error',
          }),
        );
      });
  };

  const { toast } = useToast();

  const transactionColumns: ColumnDef<TInventoryTransaction>[] = [
    {
      header: 'No',
      cell: ({ row }) => (page - 1) * take + row.index + 1,
    },
    {
      header: 'Date',
      cell: ({ row: { original } }) =>
        dayjs(original.createdAt).format('DD/MM/YYYY'),
    },
    {
      header: 'Transaction',
      accessorKey: 'name',
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row: { original } }) => {
        switch (original.type) {
          case 'IN':
            return (
              <div className="flex w-[70px] items-center justify-center gap-2 rounded-xl bg-rs-v2-mint/30 p-1 text-rs-v2-mint">
                In <MdOutlineArrowDownward size={12} />
              </div>
            );
          case 'OUT':
            return (
              <div className="flex w-[70px] items-center justify-center gap-2 rounded-xl bg-rs-v2-red/30 p-1 text-rs-v2-red">
                Out <MdOutlineArrowUpward size={12} />
              </div>
            );
          default:
            return original?.type;
        }
      },
    },
    {
      header: 'Qty',
      cell: ({ row: { original } }) =>
        original?.stock + ' ' + inventoryData?.original?.unit,
    },
    {
      header: 'Action',
      cell: ({ row: { original } }) => {
        const handleEditTransaction = (transaction: TInventoryTransaction) => {
          setSelectedTransaction(transaction);
          toggleTransactionForm(true);
        };

        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleEditTransaction(original)}
              className="bg-transparent p-[5px] text-rs-baltic-blue hover:bg-rs-baltic-blue hover:text-white"
            >
              <MdOutlineEdit size={24} />
            </Button>

            <Button
              onClick={() => {
                setSelectedDeleteTransaction(original);
                toggleDelete();
              }}
              className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
            >
              <MdDeleteOutline size={24} />
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <ExpansionTable
        columns={transactionColumns}
        data={transactionData?.entities ?? []}
        isLoading={isLoadingTransaction}
        isShowPagination={true}
        isFullWidth
        backendPagination={
          transactionData?.meta && (
            <div className="px-3 pb-3">
              <TableBackendPagination
                page={page}
                take={take}
                meta={transactionData?.meta}
                setLimit={setLimit}
                setPage={setPage}
                syncWithParams={false}
              />
            </div>
          )
        }
      />
      <Modal
        title="Delete Transaction"
        toggle={toggleDelete}
        isShown={isShownDelete}
        description="Are you sure want to delete this transaction?"
      >
        <DrawerFooter className="flex flex-row justify-end gap-4 pb-0 pt-2">
          <DrawerClose asChild>
            <Button className="btn-terinary-gray hover:hover-btn-terinary-gray">
              Cancel
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              onClick={handleDeleteTransaction}
              disabled={isDeleting}
              className="btn-primary-danger hover:hover-btn-primary-danger disabled:disabled-btn-disabled-slate-blue"
            >
              {isDeleting ? (
                <Spinner size={18} borderWidth={1.5} isFullWidthAndHeight />
              ) : (
                'Delete'
              )}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </Modal>
    </>
  );
};

export default InventoryTransactionTable;
