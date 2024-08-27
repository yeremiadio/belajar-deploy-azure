import {
  useMemo,
  // useState
} from 'react';
import { useNavigate } from 'react-router-dom';
// import {
//   useSelector,
//   // useDispatch
// } from 'react-redux';
import { MdChevronLeft } from 'react-icons/md';
import { ColumnDef } from '@tanstack/react-table';

// import {
//   selectOrder,
//   // updateReadyValues,
// } from '@/stores/purchaseOrderStore/purchaseOrderSlice';

import { ROUTES } from '@/utils/configs/route';
import { useModal } from '@/utils/hooks/useModal';

import {
  TInventoryItem,
  TPurchaseOrderRequestFormObject,
} from '@/types/api/order';
import { IInventory } from '@/types/api/management/inventory';

// import InputComponent from '@/components/InputComponent';
import { BaseTable } from '@/components/Table/BaseTable';
import { Button } from '@/components/ui/button';
import Modal from '@/components/Modal';

import WorkOrderForm from '@/pages/Inventory/WorkOrder/_components/WorkOrderForm';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  formObject: UseFormReturn<TPurchaseOrderRequestFormObject>;
}

const ConfirmInventoryTable = ({ formObject }: Props) => {
  const navigate = useNavigate();
  const order = formObject.watch(
    'inventoryList',
  ) as TInventoryItem<IInventory>[];

  const { isShown: isShownAddWorkOrder, toggle: toggleAddWorkOrder } =
    useModal();

  const columns: ColumnDef<TInventoryItem<IInventory>>[] = useMemo(
    () => [
      {
        header: 'Inventory',
        accessorKey: 'inventory.name',
      },
      {
        header: 'Required',
        accessorKey: 'quantity',
      },
      {
        header: 'In Stock',
        accessorKey: 'inventory.stock',
      },
      {
        header: 'Ready',
        cell: ({ row: { original } }) => {
          const readyValue = Math.min(
            original.quantity,
            original.inventory.stock,
          );
          return readyValue;
          // const [localReadyValue, setLocalReadyValue] = useState(
          //   order.readyValues[original.id]?.toString() || '0',
          // );
          // return (
          //   <InputComponent
          //   type="number"
          //   value={localReadyValue}
          //   max={original.quantity}
          //   onChange={(e) => {
          //     let newValue = parseInt(e.target.value);
          //     if (newValue > original.quantity) {
          //       newValue = original.quantity;
          //     } else if (newValue < 0) {
          //       newValue = 0;
          //     }
          //     setLocalReadyValue(newValue.toString());
          //   }}
          //   onBlur={() => {
          //     const newValue = parseInt(localReadyValue);
          //     dispatch(updateReadyValues({ [original.id]: newValue }));
          //   }}
          //   inputStyle="bg-rs-v2-slate-blue hover:bg-rs-v2-slate-blue !focus-visible:bg-rs-v2-slate-blue"
          //   />
          // )
        },
      },
      {
        header: 'Gap',
        cell: ({ row: { original } }) => {
          const readyValue = Math.min(
            original.quantity,
            original.inventory.stock,
          );
          const gap = original.quantity - readyValue;
          return gap > 0 ? gap : 0;
        },
      },
      {
        header: 'Stock Status',
        cell: ({ row: { original } }) => {
          const readyValue = Math.min(
            original.quantity,
            original.inventory.stock,
          );
          const gap = original.quantity - readyValue;

          if (gap > 0) {
            return (
              <span className="text-md inline-flex items-center whitespace-nowrap rounded-full bg-red-500/30 px-[5px] py-[2px] font-medium text-red-400">
                Stock Not Enough
              </span>
            );
          } else {
            return (
              <span className="text-md inline-flex items-center whitespace-nowrap  rounded-full bg-emerald-500/30 px-[5px] py-[2px] font-medium text-emerald-400">
                Stock Enough
              </span>
            );
          }
        },
      },
      {
        header: 'Action',
        accessorKey: 'id',
        cell: () => {
          return (
            <Button
              className="bg-yellow-200 text-rs-v2-galaxy-blue hover:bg-yellow-200/80"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleAddWorkOrder();
              }}
            >
              Create Work Order
            </Button>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <Modal
        title="Add Work Order"
        toggle={toggleAddWorkOrder}
        isShown={isShownAddWorkOrder}
      >
        <WorkOrderForm toggle={toggleAddWorkOrder} />
      </Modal>

      <div className="flex flex-row items-center gap-2">
        <Button
          className="w-10 border-[1px] border-rs-v2-gunmetal-blue bg-rs-v2-navy-blue p-0 hover:bg-rs-v2-navy-blue"
          onClick={() => navigate(ROUTES.purchaseOrderCreate)}
        >
          <MdChevronLeft className="text-2xl text-white" />
        </Button>
        <p>Confirm Inventory</p>
      </div>

      <BaseTable
        name="confirmInventoryTable"
        columns={columns}
        data={order || []}
        hidePagination
        isShowNumbering={false}
      />

      <div className="flex items-center justify-end">
        <Button
          className="bg-rs-v2-mint hover:bg-rs-v2-mint/80"
          onClick={() => navigate(ROUTES.purchaseOrderCreate)}
        >
          Confirm Stock Order
        </Button>
      </div>
    </>
  );
};

export default ConfirmInventoryTable;
