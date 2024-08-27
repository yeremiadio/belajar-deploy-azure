import { Fragment, useMemo, useState } from 'react';
import { Controller, UseFormReturn, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  MdDeleteOutline,
  MdOutlineEdit,
  // MdOutlineInfo
} from 'react-icons/md';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';

import { useGetPurchaseOrderByIdQuery } from '@/stores/purchaseOrderStore/purchaseOrderApi';

import {
  OrderStatusEnum,
  TInventoryItem,
  TPurchaseOrderRequestFormObject,
} from '@/types/api/order';
import { IInventory } from '@/types/api/management/inventory';

import { ROUTES } from '@/utils/configs/route';
import { useModal } from '@/utils/hooks/useModal';
import convertNumberToStringRupiah from '@/utils/functions/convertNumberToStringRupiah';
import useCalculateOrderProduct from '@/utils/functions/order/useCalculateOrderProduct';
import getStatusPermissions from '@/utils/functions/order/getStatusPermissions';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import DivPropagationWrapper from '@/components/DivPropagationWrapper';
import InputComponent from '@/components/InputComponent';
import Modal from '@/components/Modal';

import AddInventoryForm from '@/pages/PurchaseOrder/PurchaseOrderCreate/_components/AddInventoryForm';

type Props = {
  orderFormObject: UseFormReturn<TPurchaseOrderRequestFormObject>;
  orderId?: string;
};

const OrderInventoryTable = ({ orderFormObject, orderId }: Props) => {
  const navigate = useNavigate();

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

  const { control, watch } = orderFormObject;
  const { remove } = useFieldArray({
    control,
    name: 'inventoryList',
  });
  const watchInventoryList = watch('inventoryList');

  const [selectedInventory, setSelectedInventory] = useState<
    TInventoryItem<IInventory> | undefined
  >();

  const { isShown: isShownAddInventory, toggle: toggleAddInventory } =
    useModal();
  const { isShown: isShownEditInventory, toggle: toggleEditInventory } =
    useModal();

  const columns = useMemo<ColumnDef<TInventoryItem<IInventory>>[]>(() => {
    const inventoryColumns: ColumnDef<TInventoryItem<IInventory>>[] = [
      {
        accessorKey: 'id',
        header: 'Inventory ID',
        cell: ({ row }) => <>{row.original.inventory?.uniqueId || '-'}</>,
      },
      {
        accessorKey: 'name',
        header: 'Inventory Name',
        cell: ({ row }) => <>{row.original.inventory?.name || '-'}</>,
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
      },
      {
        accessorKey: 'inventory.unit',
        header: 'Unit',
        cell: ({ row }) => <>{row.original.inventory?.unit || '-'}</>,
      },
      {
        accessorKey: 'price',
        header: 'Price per Unit',
        cell: ({ row: { original } }) =>
          convertNumberToStringRupiah(original.inventory?.price ?? 0) || '-',
      },
      {
        accessorKey: 'id',
        id: 'totalPrice',
        header: 'Total Price',
        cell: ({ row: { original } }) => {
          const { quantity, inventory } = original;
          const totalPrice =
            inventory?.price && quantity ? inventory.price * quantity : 0;
          return (
            <>
              {totalPrice ? convertNumberToStringRupiah(totalPrice ?? 0) : '-'}
            </>
          );
        },
      },
      {
        accessorKey: 'id',
        id: 'action',
        header: 'Action',
        cell: ({ row: { original } }) => {
          const data = original;
          const inventoryList = orderFormObject.watch('inventoryList');
          return (
            <DivPropagationWrapper className="flex items-center gap-1">
              {/* <Button
                  type="button"
                  className="bg-transparent p-[5px] text-rs-yale-blue hover:bg-rs-yale-blue hover:text-white"
                >
                  <MdOutlineInfo size={24} />
                </Button> */}
              <Button
                type="button"
                className="bg-transparent p-[5px] text-rs-baltic-blue hover:bg-rs-baltic-blue hover:text-white"
                onClick={() => {
                  setSelectedInventory(data);
                  toggleEditInventory();
                }}
                disabled={!permissions.canChangeInventory}
              >
                <MdOutlineEdit size={24} />
              </Button>
              <Button
                type="button"
                className="bg-transparent p-[5px] text-rs-v2-red hover:bg-rs-v2-red hover:text-white"
                onClick={() => {
                  const index = inventoryList?.findIndex(
                    (item) => item.id === data.id,
                  );
                  remove(index);
                }}
                disabled={!permissions.canChangeInventory}
              >
                <MdDeleteOutline size={24} />
              </Button>
            </DivPropagationWrapper>
          );
        },
      },
    ];
    return inventoryColumns;
  }, [orderData]);

  const table = useReactTable({
    data:
      (orderFormObject.watch(
        'inventoryList',
      ) as TInventoryItem<IInventory>[]) || [],
    columns: columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const { total, totalDiscount, totalTax, subTotal } = useCalculateOrderProduct(
    {
      tax: orderFormObject.watch('tax') || 0,
      discount: orderFormObject.watch('discount') || 0,
      products:
        (orderFormObject.watch(
          'inventoryList',
        ) as TInventoryItem<IInventory>[]) || [],
    },
  );

  return (
    <>
      <Modal
        title="Add Inventory"
        toggle={toggleAddInventory}
        isShown={isShownAddInventory}
      >
        <AddInventoryForm
          toggle={toggleAddInventory}
          orderFormObject={orderFormObject}
        />
      </Modal>

      <Modal
        title="Edit Inventory"
        toggle={toggleEditInventory}
        isShown={isShownEditInventory}
      >
        <AddInventoryForm
          toggle={toggleEditInventory}
          orderFormObject={orderFormObject}
          isEditing
          currentInventory={selectedInventory}
        />
      </Modal>

      <div
        className={cn(
          'flex w-full items-center',
          orderData ? 'justify-between' : 'justify-end',
        )}
      >
        {orderData && (
          <span>
            OrderID: <span className="font-bold">{orderData?.orderId}</span>
          </span>
        )}
        <Button
          type="button"
          disabled={
            orderFormObject.watch('groupInventoryId') === undefined ||
            !permissions.canChangeInventory
          }
          className="btn-secondary-midnight-blue hover:hover-btn-secondary-midnight-blue"
          onClick={() => toggleAddInventory()}
        >
          Add Inventory <AiOutlinePlus className="ml-2" />
        </Button>
      </div>

      <div className="w-full rounded-md">
        <Table aria-label="orderInventoryTable">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap bg-rs-v2-navy-blue text-white"
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-rs-v2-galaxy-blue">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    onClick={() => {
                      row.toggleExpanded();
                    }}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-12 text-center"
                >
                  No Inventory Selected
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell className="py-2" colSpan={3} />
              <TableCell className="py-2" colSpan={2}>
                Subtotal
              </TableCell>
              <TableCell
                className="py-2"
                colSpan={table.getAllColumns().length}
              >
                {convertNumberToStringRupiah(subTotal)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                className="h-12"
                colSpan={table.getAllColumns().length}
              />
            </TableRow>
            <TableRow>
              <TableCell className="border-r-0 py-2" colSpan={3} />
              <TableCell className="py-2" colSpan={1}>
                Tax
              </TableCell>
              <TableCell>
                <Controller
                  name="tax"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex flex-row items-center justify-center gap-2">
                      <InputComponent
                        placeholder="0 %"
                        onChange={(e) => {
                          const newValue = e.target.value
                            ? parseInt(e.target.value)
                            : 0;
                          if (newValue > 100) {
                            onChange(100);
                          } else {
                            onChange(newValue);
                          }
                        }}
                        value={value}
                        max={100}
                        disabled={!permissions.canChangeInventory}
                        inputStyle="bg-rs-v2-slate-blue hover:bg-rs-v2-slate-blue !focus-visible:bg-rs-v2-slate-blue"
                      />
                      <span>%</span>
                    </div>
                  )}
                />
              </TableCell>
              <TableCell
                className="py-2"
                colSpan={table.getAllColumns().length}
              >
                {convertNumberToStringRupiah(totalTax)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-r-0 py-2" colSpan={3} />
              <TableCell className="py-2" colSpan={1}>
                Discount
              </TableCell>
              <TableCell>
                <Controller
                  name="discount"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex flex-row items-center justify-center gap-2">
                      <InputComponent
                        onChange={(e) => {
                          const newValue = e.target.value
                            ? parseInt(e.target.value)
                            : 0;
                          if (newValue > 100) {
                            onChange(100);
                          } else {
                            onChange(newValue);
                          }
                        }}
                        value={value}
                        max={100}
                        disabled={!permissions.canChangeInventory}
                        inputStyle="bg-rs-v2-slate-blue hover:bg-rs-v2-slate-blue !focus-visible:bg-rs-v2-slate-blue"
                      />
                      <span>%</span>
                    </div>
                  )}
                />
              </TableCell>
              <TableCell
                className="py-2"
                colSpan={table.getAllColumns().length}
              >
                {convertNumberToStringRupiah(totalDiscount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-r-0 py-2" colSpan={3} />
              <TableCell className="py-2 font-bold text-rs-v2-mint" colSpan={2}>
                TOTAL
              </TableCell>
              <TableCell
                className="py-2 font-bold text-rs-v2-mint"
                colSpan={table.getAllColumns().length}
              >
                {convertNumberToStringRupiah(total)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex w-full justify-start">
        <Button
          type="button"
          disabled={
            !permissions.canChangeInventory || watchInventoryList?.length === 0
          }
          className="bg-rs-v2-pie-mint-green hover:bg-rs-v2-pie-mint-green/80"
          onClick={() => navigate(ROUTES.purchaseOrderConfirmInventory)}
        >
          Confirm Inventory
        </Button>
      </div>
    </>
  );
};

export default OrderInventoryTable;
