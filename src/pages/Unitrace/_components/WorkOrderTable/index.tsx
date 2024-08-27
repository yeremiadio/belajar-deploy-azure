import { ColumnDef } from '@tanstack/react-table';

import { BaseTable } from '@/components/Table/BaseTable';

import { TReservationItem, TReservationObject } from '@/types/api/reservation';

type Props = {
  yardData: TReservationObject;
};

const WorkOrderTable = ({ yardData }: Props) => {
  const columns: ColumnDef<TReservationItem>[] = [
    {
      accessorKey: 'inventory',
      header: 'Inventory',
      cell: ({ row: { original } }) => original.inventory?.name ?? '-',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row: { original } }) => {
        const { amount, inventory } = original;
        return amount && inventory ? `${amount} ${inventory?.unit}` : '-';
      },
    },
  ];
  return (
    <BaseTable
      data={yardData.reservationItems ?? []}
      columns={columns}
      isFullWidth
      isLoading={false} // loading
      hidePagination={true}
    />
  );
};

export default WorkOrderTable;
