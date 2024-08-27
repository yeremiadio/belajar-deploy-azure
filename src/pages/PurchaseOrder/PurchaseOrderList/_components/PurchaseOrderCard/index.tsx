import { FC } from 'react';
import { Draggable } from '@hello-pangea/dnd';

import convertNumberToStringRupiah from '@/utils/functions/convertNumberToStringRupiah';

import { TInventoryItem, TOrder } from '@/types/api/order';
import { IInventory } from '@/types/api/management/inventory';
import useVendorOptions from '@/utils/hooks/selectOptions/useVendorOptions';

type Props = {
  data: TOrder;
  index: number;
};

const PurchaseOrderCard: FC<Props> = ({ data, index }) => {
  const { arr: vendorOptions } = useVendorOptions({});
  const vendorName = vendorOptions.find(
    (vendor) => vendor.value === data.vendorId,
  )?.label;

  const listProduct = data.inventoryList
    ?.map((product: TInventoryItem<IInventory>) => product?.inventory?.name)
    .join(', ');

  return (
    <Draggable draggableId={data?.id.toString()} index={index}>
      {(provided) => (
        <div
          className="my-2 rounded-xl border border-rs-v2-thunder-blue bg-rs-v2-navy-blue p-4 text-center font-semibold"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p className="mb-2 text-ellipsis text-lg">{vendorName}</p>
          <div className="rounded-xl bg-rs-v2-thunder-blue p-3.5 text-sm">
            <p className="mb-2 text-lg font-bold">{data?.orderId}</p>
            <p
              className="cursor-pointer overflow-hidden truncate text-ellipsis whitespace-nowrap font-normal text-rs-neutral-gray-gull"
              title={listProduct}
            >
              {listProduct}
            </p>
            <p className="font-normal text-rs-v2-mint">
              {`(${convertNumberToStringRupiah(data?.total || 0)})`}
            </p>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default PurchaseOrderCard;
