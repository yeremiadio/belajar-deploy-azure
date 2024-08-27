import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MdDeleteOutline, MdOutlineDownload } from 'react-icons/md';
import { UseFormReturn } from 'react-hook-form';
import dayjs from 'dayjs';

import { useModal } from '@/utils/hooks/useModal';

import {
  OrderStatusEnum,
  TPurchaseOrderRequestFormObject,
} from '@/types/api/order';

import { useGetPurchaseOrderByIdQuery } from '@/stores/purchaseOrderStore/purchaseOrderApi';
import getStatusPermissions from '@/utils/functions/order/getStatusPermissions';

import { BaseTable } from '@/components/Table/BaseTable';
import { Button } from '@/components/ui/button';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import Modal from '@/components/Modal';
import { useToast } from '@/components/ui/use-toast';

import AddDocumentForm from '@/pages/PurchaseOrder/PurchaseOrderCreate/_components/AddDocumentForm';

import { useDeleteOrderFileMutation } from '@/stores/purchaseOrderStore/orderFileApi';

import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import { downloadFileWithBearerToken } from '@/utils/functions/downloadFileWithBearerToken';

import { TOrderFile } from '@/types/api/order/orderDocument';
import { ErrorMessageBackendDataShape } from '@/types/api';

type Props = {
  orderFormObject: UseFormReturn<TPurchaseOrderRequestFormObject>;
  orderId?: string;
};

// @ts-ignore
const OrderDocumentTable = ({ orderFormObject, orderId }: Props) => {
  const { isShown: isShownAddDocument, toggle: toggleAddDocument } = useModal();

  const { toast } = useToast();

  const { data: orderData } = useGetPurchaseOrderByIdQuery(
    {
      id: Number(orderId),
    },
    {
      skip: !orderId,
    },
  );

  const permissions = getStatusPermissions(
    orderData?.status as OrderStatusEnum,
  );

  const columns: ColumnDef<TOrderFile>[] = useMemo(
    () => [
      {
        header: 'Document Label',
        accessorKey: 'label',
      },
      {
        header: 'Annotation',
        accessorKey: 'annotation',
        cell: ({ row: { original } }) => {
          return original.annotation || '-';
        },
      },
      {
        header: 'Time Upload',
        cell: ({ row: { original } }) => {
          return original.createdAt
            ? dayjs(original.createdAt).format('DD/M/YYYY - HH:mm')
            : '-';
        },
      },
      {
        header: 'Action',
        accessorKey: 'id',
        cell: ({ row: { original } }) => {
          const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
          const [deleteDocument] = useDeleteOrderFileMutation();

          const handleDelete = () => {
            deleteDocument(original.id)
              .unwrap()
              .then(() => {
                toggleDelete();
                toast(
                  generateDynamicToastMessage({
                    title: 'Success',
                    description: 'Document deleted successfully',
                    variant: 'success',
                  }),
                );
              })
              .catch((error: ErrorMessageBackendDataShape) => {
                const { title, message } = generateStatusCodesMessage(
                  error.status,
                );
                toast(
                  generateDynamicToastMessage({
                    title,
                    description: `${message} "\n${error?.data?.message ?? ''}"`,
                    variant: 'error',
                  }),
                );
              });
          };

          return (
            <DivPropagationWrapper className="flex items-center gap-1">
              <Modal
                title="Delete Delivery"
                toggle={toggleDelete}
                isShown={isShownDelete}
                description={
                  <span>
                    Deleting "(id: {original.id})" will result in it's{' '}
                    <b>permanent</b> deletion from the system, impacting all
                    associated data related to this Document.
                  </span>
                }
              >
                <div className="flex flex-row justify-end gap-4 px-0 pb-0 pt-2">
                  <div>
                    <Button
                      onClick={() => toggleDelete()}
                      className="btn-terinary-gray hover:hover-btn-terinary-gray"
                    >
                      Cancel
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="btn-primary-danger hover:hover-btn-primary-danger"
                      onClick={handleDelete}
                      type="button"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Modal>
              <Button
                className="bg-transparent p-2 hover:bg-transparent"
                onClick={() => {
                  downloadFileWithBearerToken(original.fileUrl);
                }}
                type="button"
              >
                <MdOutlineDownload size={24} className="text-rs-azure-blue" />
              </Button>
              <Button
                type="button"
                className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
                onClick={() => {
                  toggleDelete();
                }}
                disabled={!permissions.canChangeDocument}
              >
                <MdDeleteOutline size={24} />
              </Button>
            </DivPropagationWrapper>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <Modal
        title="Add Document"
        toggle={toggleAddDocument}
        isShown={isShownAddDocument}
      >
        <AddDocumentForm toggle={toggleAddDocument} />
      </Modal>

      <BaseTable
        name="orderDocumentTable"
        columns={columns}
        data={orderData?.orderFiles || []}
        hidePagination
        isShowNumbering={false}
        noDataText="No order document available"
      />

      <div className="flex w-full justify-start">
        <Button
          type="button"
          className="bg-rs-v2-pie-mint-green hover:bg-rs-v2-pie-mint-green/80"
          onClick={() => toggleAddDocument()}
          disabled={!permissions.canChangeDocument}
        >
          Add New Document
        </Button>
      </div>
    </>
  );
};

export default OrderDocumentTable;
