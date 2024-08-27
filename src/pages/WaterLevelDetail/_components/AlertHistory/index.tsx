import dayjs from 'dayjs';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { FC, useState } from 'react';
import { MdOutlineWarningAmber, MdSearch } from 'react-icons/md';

import Card from '@/components/Card';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useGetDeviceAlertLogsQuery } from '@/stores/managementStore/deviceStore/deviceStoreApi';
import { IDeviceLocationWaterLevelObj } from '@/types/api/ews';
import { getSensorData } from '@/utils/functions/getSensorData';

type Props = {
  data: IDeviceLocationWaterLevelObj | undefined;
};

const AlertHistory: FC<Props> = ({ data: deviceData }: Props) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const searchKeywordDebounce = useDebounce(searchKeyword, 500);

  const { data } = useGetDeviceAlertLogsQuery(
    {
      id: Number(deviceData?.device_summary.id) ?? 0,
      page: 1,
      take: 20,
      search: searchKeywordDebounce,
    },
    {
      skip: !deviceData?.device_summary?.id,
    },
  );

  return (
    <Card className="flex h-full flex-col gap-5 border-none bg-transparent px-4 pt-5">
      <h2 className="text-xl font-medium">Alert History</h2>
      <Input
        addonRight={<MdSearch className="h-[24px] w-[24px]" />}
        className="min-h-[44px] border border-rs-v2-thunder-blue bg-rs-v2-navy-blue focus-within:border-rs-v2-mint focus-within:ring-0 focus-within:ring-offset-0 hover:border-rs-v2-mint"
        type="search"
        placeholder="Search Log"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

      <OverlayScrollbarsComponent
        options={{
          scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' },
        }}
        defer
      >
        <div className="flex flex-col gap-3 rounded-lg">
          {data?.map((item) => {
            const isWarning = item?.status === 'WARNING';
            const isCritical = item?.status === 'CRITICAL';
            const { unit } = getSensorData(item?.sensor?.code);
            return (
              <div
                className="flex flex-col rounded-lg bg-rs-v2-thunder-blue p-4"
                key={item.id}
              >
                <div className="flex items-center justify-between gap-2 border-b border-rs-v2-silver/10 pb-2">
                  <p>Sensor: {item?.sensor?.name ?? '-'}</p>
                  <MdOutlineWarningAmber
                    className={cn(
                      isWarning && 'text-rs-alert-yellow',
                      isCritical && 'text-rs-v2-red',
                    )}
                    size={16}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 pt-2 text-sm">
                  <div className="flex items-center gap-2 text-rs-neutral-gray-gull">
                    <p>
                      {item && item.time
                        ? dayjs(item?.time)?.format('DD MMMM YYYY')
                        : '-'}
                    </p>
                    <span className="h-1 w-1 rounded-full bg-rs-neutral-gray-gull" />
                    {item && item.time
                      ? dayjs(item?.time)?.format('HH:mm')
                      : '-'}
                  </div>
                  <p
                    className={cn(
                      isWarning && 'text-rs-alert-yellow',
                      isCritical && 'text-rs-v2-red',
                      'font-medium',
                    )}
                  >
                    {item.value ? item?.value : 0} {unit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </OverlayScrollbarsComponent>
    </Card>
  );
};

export default AlertHistory;
