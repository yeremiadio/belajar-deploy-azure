import { FC, useMemo } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';

import useOrderStatusOptions from '@/utils/hooks/selectOptions/useOrderStatusOptions';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import { ROUTES } from '@/utils/configs/route';

import { StrictModeDroppable } from '@/components/StrictModeDroppable';
import { useToast } from '@/components/ui/use-toast';

import {
  useGetPurchaseOrderQuery,
  useUpdatePurchaseOrderMutation,
} from '@/stores/purchaseOrderStore/purchaseOrderApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { OrderStatusEnum, TOrder } from '@/types/api/order';

import PurchaseOrderCard from '../PurchaseOrderCard';

type Props = {
  searchKeyword: string;
};

const PurchaseOrderBoard: FC<Props> = ({ searchKeyword }) => {
  const { data: orderStatusOpt } = useOrderStatusOptions();
  const { data: purchaseOrderData } = useGetPurchaseOrderQuery({
    isPaginated: false,
    search: searchKeyword,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const orderStatusOptFiltered = useMemo(() => {
    return orderStatusOpt.filter(
      (opt) => opt.value !== OrderStatusEnum.COMPLETE,
    );
  }, [orderStatusOpt]);

  const purchaseOrderMemo = useMemo<TOrder[]>(() => {
    if (!purchaseOrderData) return [];
    const purchaseOrderList = purchaseOrderData.entities?.slice();
    return purchaseOrderList;
  }, [purchaseOrderData]);

  const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) return;

    // dropped in the same column
    if (source.droppableId === destination.droppableId) {
      return;
    }

    const sourceColumn = orderStatusOpt.find(
      (column) => column.value === source.droppableId,
    );

    const destinationColumn = orderStatusOpt.find(
      (column) => column.value === destination.droppableId,
    );

    // if sourceColumn or destinationColumn is undefined, return
    if (!sourceColumn || !destinationColumn) return;

    await updatePurchaseOrder({
      id: purchaseOrderMemo[source.index].id,
      data: {
        status: destinationColumn.value,
      },
    })
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'Order status is updated successfully',
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid h-full w-full min-w-[1000px] grid-cols-5 gap-6 overflow-x-auto">
        {orderStatusOptFiltered.map((column) => (
          <div className="flex h-full flex-col gap-2" key={column.value}>
            <p className="rounded-xl border border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-2 text-center font-semibold">
              {column.label}
            </p>
            <StrictModeDroppable droppableId={column.value} key={column.value}>
              {(provided) => (
                <div
                  className="flex h-full flex-col"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {purchaseOrderMemo?.map((order, index) => {
                    if (order.inventoryList.length === 0) return null;
                    if (order.status !== column.value) return null;
                    // if (
                    //   searchKeyword !== '' &&
                    //   order?.vendorId
                    //     ?.toString()
                    //     .toLowerCase()
                    //     .includes(searchKeyword.toLowerCase()) === false
                    // )
                    //   return null;
                    return (
                      <div
                        onClick={() =>
                          navigate(
                            ROUTES.purchaseOrderCreate + `?id=${order.id}`,
                          )
                        }
                        key={order.id}
                      >
                        <PurchaseOrderCard
                          data={order}
                          index={index}
                          key={order.id}
                        />
                      </div>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default PurchaseOrderBoard;
