import { FC } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { BaseTable } from '@/components/Table/BaseTable';

import { useGetProductionLogQuery } from '@/stores/inventoryStore/workOrderStore/workOrderStoreApi';

import { TWorkOrderProductionLog } from '@/types/api/inventory/workOrder';

type Props = {
  toggle: (open?: boolean) => void;
  id: number;
};

const ProductionHistory: FC<Props> = ({ id }) => {
  const { data, isLoading } = useGetProductionLogQuery(
    { id },
    {
      skip: !id,
    },
  );

  const transformTableData = [...(data ?? [])]
    .sort((a, b) => {
      if (a?.createdAt < b?.createdAt) {
        return -1;
      }
      if (a?.createdAt > b?.createdAt) {
        return 1;
      }
      return 0;
    })
    .map((item, index) => ({
      ...item,
      hourIndex: index + 1,
    }));

  const columns: ColumnDef<TWorkOrderProductionLog & { hourIndex: number }>[] =
    [
      {
        header: '1 Hour',
        accessorKey: 'hourIndex',
      },
      {
        header: 'Production Output',
        accessorKey: 'productionOutput',
      },
      {
        header: 'Not Good Product',
        accessorKey: 'notGoodProductionOutput',
      },
    ];

  return (
    <div>
      <BaseTable
        data={isLoading ? [] : transformTableData}
        columns={columns}
        isLoading={isLoading}
        isFullWidth
        hidePagination
        isShowNumbering={false}
      />
    </div>
  );
};

export default ProductionHistory;
