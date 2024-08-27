import { ColumnDef } from '@tanstack/react-table';
import { FC } from 'react';
import { BaseTable } from '@/components/Table/BaseTable';
import { TReservationItem } from '@/types/api/reservation';
import { cn } from '@/lib/utils';

interface Props {
  reservationItem: TReservationItem[];
}

export const TableInventory: FC<Props> = ({ reservationItem }) => {
  const columns: ColumnDef<TReservationItem>[] = [
    {
      accessorKey: 'name',
      header: 'Inventory',
      cell: ({ row: { original } }) => original?.inventory?.name ?? '-',
    },
    {
      accessorKey: 'qty',
      header: 'Qty',
      cell: ({ row: { original } }) => {
        const { amount, inventory } = original;
        return amount && inventory ? `${amount} ${inventory?.unit}` : '-';
      },
    },
    {
      accessorKey: 'actual',
      header: 'Actual',
      cell: ({ row: { original } }) => {
        const { actualAmount, inventory } = original;
        return (
          <p className={cn(actualAmount > 0 && 'text-rs-v2-mint')}>
            {actualAmount && inventory
              ? `${actualAmount} ${inventory?.unit}`
              : '-'}
          </p>
        );
      },
    },
  ];

  return (
    <BaseTable
      name="inventoryTable"
      data={reservationItem}
      columns={columns}
      isFullWidth
      isLoading={false} // loading
      hidePagination={true}
    />
  );
};
