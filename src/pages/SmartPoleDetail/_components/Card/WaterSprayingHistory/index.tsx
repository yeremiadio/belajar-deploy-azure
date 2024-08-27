import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { Card } from '@/pages/SmartPoleDetail/_components/Card';
import {
    useGetSprayWaterHistoryDeviceSmartPoleQuery
} from '@/stores/smartPoleStore/smartPoleStoreApi';
import { convertToIsoString } from '@/utils/functions/dateFormat';

import { WaterSprayCard } from './WaterSprayCard';

interface Props {}

export const WaterSprayingHistory: FC<Props> = () => {
  const { id: smart_pole_id } = useParams<'id'>();
  const { gatewayId } = useParams<'gatewayId'>();

  // filter
  const [filter, setFilter] = useState<string>();

  // redux
  const {
    data: sprayWaterHistoryList,
    isLoading,
    isFetching,
  } = useGetSprayWaterHistoryDeviceSmartPoleQuery({
    id: smart_pole_id ?? '',
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
    filterData: filter ? convertToIsoString(filter) : undefined,
  });
  const loading = isLoading || isFetching;

  const dataMemo = useMemo(() => {
    if (!sprayWaterHistoryList || sprayWaterHistoryList.length === 0) return [];

    const data = sprayWaterHistoryList.slice();
    return data;
  }, [sprayWaterHistoryList]);

  return (
    <Card
      border={false}
      title="Water Spraying History"
      className="pb-0 pt-0 md:pt-6"
    >
      <div className="box-border h-full w-full overflow-hidden">
        <Input
          className="w-full cursor-text bg-rs-v2-slate-blue"
          type="date"
          placeholder="Search Log"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />

        {!loading ? (
          <div className="mt-4 box-border grid h-full w-full auto-rows-max grid-cols-1 gap-4 overflow-y-auto pb-14">
            {dataMemo?.map((item, index: number) => (
              <WaterSprayCard key={index} data={item} />
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </Card>
  );
};
