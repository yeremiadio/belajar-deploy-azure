import { FC, useState } from 'react';
import dayjs from 'dayjs';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { MdOutlineWarningAmber, MdSearch } from 'react-icons/md';

import Card from '@/components/Card';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';

import { TGatewayDevice } from '@/types/api/socket';

import { useGetDeviceAlertLogsQuery } from '@/stores/managementStore/deviceStore/deviceStoreApi';

import { getSensorData } from '@/utils/functions/getSensorData';
import { useDebounce } from '@/utils/hooks/useDebounce';

type Props = {
  deviceData?: TGatewayDevice;
};

const AlertHistory: FC<Props> = ({ deviceData }) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const searchKeywordDebounce = useDebounce(searchKeyword, 500);

  const { data } = useGetDeviceAlertLogsQuery(
    {
      id: deviceData?.id ?? 0,
      page: 1,
      take: 20,
      search: searchKeywordDebounce,
    },
    {
      skip: !deviceData?.id,
    },
  );

  return (
    <Card className="flex h-full flex-col gap-5 overflow-hidden  border-none bg-transparent px-4 pt-5">
      <h2 className="text-xl font-medium">Alert History</h2>
      <div className="shrink-0">
        <Input
          addonRight={<MdSearch className="h-[24px] w-[24px]" />}
          className="border border-rs-v2-thunder-blue bg-rs-v2-navy-blue focus-within:border-rs-v2-mint focus-within:ring-0 focus-within:ring-offset-0 hover:border-rs-v2-mint"
          type="search"
          placeholder="Search Log"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <OverlayScrollbarsComponent
        className="h-full min-h-[300px]"
        options={{
          scrollbars: { autoHide: 'scroll', theme: 'os-theme-rs' },
          overflow: {
            x: 'hidden',
            y: data?.length === 0 ? 'hidden' : 'scroll',
          },
        }}
        defer
      >
        <div className="flex h-full flex-col gap-3 rounded-lg">
          {data?.map((notif) => {
            const isWarning = notif?.status === 'WARNING';
            const isCritical = notif?.status === 'CRITICAL';

            const { unit } = getSensorData(notif?.sensor?.code);
            return (
              <div
                className="flex flex-col rounded-lg bg-rs-v2-thunder-blue p-4"
                key={notif?.id}
              >
                <div className="flex items-center justify-between gap-2 border-b border-rs-v2-silver/10 pb-2">
                  <p>Sensor: {notif?.sensor?.name}</p>
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
                    <p>{dayjs(notif?.time)?.format('DD MMMM YYYY')}</p>
                    <span className="h-1 w-1 rounded-full bg-rs-neutral-gray-gull" />
                    <p>{dayjs(notif?.time)?.format('HH:mm')}</p>
                  </div>
                  <p
                    className={cn(
                      isWarning && 'text-rs-alert-yellow',
                      isCritical && 'text-rs-v2-red',
                      'font-medium',
                    )}
                  >
                    {notif?.value} {unit}
                  </p>
                </div>
              </div>
            );
          })}

          {data?.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p>Data Not Found</p>
            </div>
          )}
        </div>
      </OverlayScrollbarsComponent>
    </Card>
  );
};

export default AlertHistory;
