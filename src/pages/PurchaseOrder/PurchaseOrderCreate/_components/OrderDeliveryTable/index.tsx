import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MdDeleteOutline, MdOutlineEdit } from 'react-icons/md';
import { UseFormReturn } from 'react-hook-form';
import dayjs from 'dayjs';

import { cn } from '@/lib/utils';

import {
  OrderStatusEnum,
  TPurchaseOrderRequestFormObject,
} from '@/types/api/order';
import {
  DeliveryStatusEnum,
  TOrderDelivery,
} from '@/types/api/order/orderDelivery';

import {
  useGetPurchaseOrderByIdQuery,
  useGetPurchaseOrderInventoryListQuery,
} from '@/stores/purchaseOrderStore/purchaseOrderApi';
import { useModal } from '@/utils/hooks/useModal';
import getStatusPermissions from '@/utils/functions/order/getStatusPermissions';

import { BaseTable } from '@/components/Table/BaseTable';
import { Button } from '@/components/ui/button';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import convertTitleCase from '@/utils/functions/convertTitleCase';
import Modal from '@/components/Modal';

import AddDeliveryForm from '@/pages/PurchaseOrder/PurchaseOrderCreate/_components/AddDeliveryForm';
import { useDeleteDeliveryOrderMutation } from '@/stores/purchaseOrderStore/deliveryOrderApi';
import { toast } from '@/components/ui/use-toast';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import { ErrorMessageBackendDataShape } from '@/types/api';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

type Props = {
  orderFormObject: UseFormReturn<TPurchaseOrderRequestFormObject>;
  orderId?: string;
};

// @ts-ignore
const OrderDeliveryTable = ({ orderFormObject, orderId }: Props) => {
  const { isShown: isShownAddDelivery, toggle: toggleAddDelivery } = useModal();
  const { toggle: toggleEdit, isShown: isShownEdit } = useModal();
  const [selectedDelivery, setSelectedDelivery] = useState<TOrderDelivery>();

  const { data: orderData } = useGetPurchaseOrderByIdQuery(
    {
      id: Number(orderId),
    },
    {
      skip: !orderId,
    },
  );

  const { data: currentInventoryList } = useGetPurchaseOrderInventoryListQuery({
    id: Number(orderId),
  });

  const permissions = getStatusPermissions(
    orderData?.status as OrderStatusEnum,
  );

  const columns: ColumnDef<TOrderDelivery>[] = useMemo(
    () => [
      {
        header: 'Delivery ID',
        cell: ({ row: { original } }) => {
          return original.deliveryId || '-';
        },
      },
      {
        header: 'Expected Delivery',
        cell: ({ row: { original } }) => {
          return original.expectedDeliveryDate
            ? dayjs(original.expectedDeliveryDate).format('DD/M/YYYY')
            : '-';
        },
      },
      {
        header: 'Vehicle Plate',
        cell: ({ row: { original } }) => {
          return original?.reservation?.licensePlate?.plate || '-';
        },
      },
      {
        header: 'Driver',
        cell: ({ row: { original } }) => {
          return original?.reservation?.driver?.name || '-';
        },
      },
      {
        header: 'Annotation',
        accessorKey: 'annotation',
        cell: ({ row: { original } }) => {
          return original.annotation || '-';
        },
      },
      {
        header: 'Delivery Status',
        cell: ({ row: { original } }) => {
          const status: string = original.status || '';
          const switchColorChip = useMemo((): {
            backgroundColor: string;
            textColor: string;
          } | null => {
            switch (status) {
              case DeliveryStatusEnum.ON_PROCESS:
                return {
                  backgroundColor: '#6d7a54',
                  textColor: '#b3c657',
                };
              case DeliveryStatusEnum.CONFIRMED:
                return {
                  backgroundColor: '#4b777e',
                  textColor: '#6fdbd1',
                };
              case DeliveryStatusEnum.DELIVERED:
                return {
                  backgroundColor: '#426185',
                  textColor: '#549de0',
                };
              case DeliveryStatusEnum.NOT_RECEIVED:
                return {
                  backgroundColor: '#734854',
                  textColor: '#d25557',
                };
              default:
                return null;
            }
          }, [status]);
          return (
            <div
              className={cn('flex w-fit flex-row rounded-full px-3 py-1')}
              style={{
                background: switchColorChip?.backgroundColor,
                color: switchColorChip?.textColor,
              }}
            >
              {convertTitleCase(status) || '-'}
            </div>
          );
        },
      },
      {
        header: 'Action',
        accessorKey: 'id',
        cell: ({ row: { original } }) => {
          const haveStatus = !!original.status;
          const data = original;
          const { toggle: toggleDelete, isShown: isShownDelete } = useModal();
          const [deleteDelivery] = useDeleteDeliveryOrderMutation();

          const handleDelete = async () => {
            toggleDelete();
            await deleteDelivery({ id: data.id })
              .unwrap()
              .then(() => {
                toast(
                  generateDynamicToastMessage({
                    title: 'Success',
                    description: `Delivery Order (id: ${data.id}) deleted successfully`,
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
                    Deleting "{data.deliveryId}" will result in it's{' '}
                    <b>permanent</b> deletion from the system, impacting all
                    associated data related to this Delivery.
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
                type="button"
                className="bg-transparent p-[5px] text-rs-baltic-blue hover:bg-rs-baltic-blue hover:text-white"
                onClick={async () => {
                  setSelectedDelivery(data);
                  toggleEdit();
                }}
                disabled={!permissions.canChangeDelivery || haveStatus}
              >
                <MdOutlineEdit size={24} />
              </Button>
              <Button
                type="button"
                className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
                onClick={() => toggleDelete()}
                disabled={!permissions.canChangeDelivery || haveStatus}
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
        title="Add Delivery"
        toggle={toggleAddDelivery}
        isShown={isShownAddDelivery}
      >
        <AddDeliveryForm
          toggle={toggleAddDelivery}
          currentInventoryList={currentInventoryList}
          vendorId={orderData?.vendorId}
        />
      </Modal>
      <Modal isShown={isShownEdit} title="Edit Delivery" toggle={toggleEdit}>
        <AddDeliveryForm
          toggle={toggleEdit}
          currentInventoryList={currentInventoryList}
          selectedDelivery={selectedDelivery}
        />
      </Modal>

      <BaseTable
        name="orderDeliveryTable"
        columns={columns}
        data={orderData?.orderDeliveries || []}
        hidePagination
        isShowNumbering={false}
        noDataText="No delivery order available"
      />

      <div className="flex w-full justify-start">
        <Button
          type="button"
          className="bg-rs-v2-pie-mint-green hover:bg-rs-v2-pie-mint-green/80"
          onClick={() => toggleAddDelivery()}
          disabled={!permissions.canChangeDelivery}
        >
          Add New Delivery
        </Button>
      </div>
    </>
  );
};

export default OrderDeliveryTable;
