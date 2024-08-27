import { ColumnDef, Row } from '@tanstack/react-table';
import { useMemo } from 'react';

import { ExpansionTable } from '@/components/Table/ExpansionTable';

import { IInventory, IInventoryGroupWithPrice } from '@/types/api/management/inventory';
import convertNumberToStringRupiah from '@/utils/functions/convertNumberToStringRupiah';


const InventoryGroupsTable = ({ original: dataInventory }: Row<IInventory>) => {

  const dataMemo = useMemo<IInventoryGroupWithPrice[]>(() => {
    if (!dataInventory) return [];
    const groupList = dataInventory.group;
    return groupList;
  }, [dataInventory]);

  const columns: ColumnDef<IInventoryGroupWithPrice>[] = [
    {
      accessorKey: 'no',
      header: 'No.',
      maxSize: 10,
      cell: (context) => context.row.index + 1,
    },
    {
      accessorKey: 'name',
      header: 'Group Name',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row: { original } }) => {
        const price = original.price
        return (
          <>{price ? convertNumberToStringRupiah(price) : '-'}</>
        );
      },
   
    },
  ];
  return (
    <ExpansionTable isShowNumbering columns={columns} data={dataMemo} isShowPagination={false}/>
  )
};

export default InventoryGroupsTable;
