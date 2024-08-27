import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { Card } from '@/pages/SmartPoleDetail/_components/Card';

import { useGetInformationDeviceSmartPoleQuery } from '@/stores/smartPoleStore/smartPoleStoreApi';

import { TInformationSmartPole } from '@/types/api/smartPole';

interface Props {}

export const SmartPoleInformation: FC<Props> = () => {
  const { id: smart_pole_id } = useParams<'id'>();
  const { gatewayId } = useParams<'gatewayId'>();

  const {
    data: informationDevice,
    isLoading,
    isFetching,
  } = useGetInformationDeviceSmartPoleQuery(
    {
      id: smart_pole_id ? Number(smart_pole_id) : undefined,
      gatewayId: gatewayId ? Number(gatewayId) : undefined,
    },
    {
      skip: !smart_pole_id || !gatewayId,
    },
  );
  const loading = isLoading || isFetching;

  const dataMemo = useMemo<TInformationSmartPole | undefined>(() => {
    if (!informationDevice) return undefined;

    const data = { ...informationDevice };
    return data;
  }, [informationDevice]);

  return (
    <Card border={true} title="Smart Pole Information">
      {!loading ? (
        <div className="box-border flex h-full w-full overflow-hidden">
          <div className="flex w-full flex-col justify-between rounded-xl bg-rs-v2-galaxy-blue p-4">
            <div className="flex items-start justify-between">
              <p className="text-base font-normal">Model</p>
              <p className="text-lg font-semibold">{dataMemo?.model ?? '-'}</p>
            </div>
            <div className="flex items-start justify-between">
              <p className="text-base font-normal">Device</p>
              <p className="text-lg font-semibold">{dataMemo?.name ?? '-'}</p>
            </div>
            <div className="flex items-start justify-between">
              <p className="text-base font-normal">Health</p>
              <p className="text-lg font-semibold">{dataMemo?.health ?? '-'}</p>
            </div>
            <div className="flex items-start justify-between">
              <p className="text-base font-normal">Status Device</p>
              <p
                className={cn(
                  'text-lg font-semibold',
                  dataMemo?.status ? 'text-rs-alert-green' : 'text-rs-v2-red',
                )}
              >
                {dataMemo?.status ? 'ON' : 'OFF'}
              </p>
            </div>
            <div className="flex items-start justify-between">
              <p className="text-base font-normal">Status Spray</p>
              <p
                className={cn(
                  'text-lg font-semibold',
                  dataMemo?.spray ? 'text-rs-alert-green' : 'text-rs-v2-red',
                )}
              >
                {dataMemo?.spray ? 'ON' : 'OFF'}
              </p>
            </div>
            <div className="flex items-start justify-between">
              <p className="text-base font-normal">Lamp</p>
              <p
                className={cn(
                  'text-lg font-semibold',
                  dataMemo?.lamp ? 'text-rs-alert-green' : 'text-rs-v2-red',
                )}
              >
                {dataMemo?.lamp ? 'ON' : 'OFF'}
              </p>
            </div>
            <div className="flex items-start justify-between">
              <p className="text-base font-normal">Hotspot</p>
              <p
                className={cn(
                  'text-lg font-semibold',
                  dataMemo?.hotspot ? 'text-rs-alert-green' : 'text-rs-v2-red',
                )}
              >
                {dataMemo?.hotspot ? 'ON' : 'OFF'}
              </p>
            </div>
            <div className="flex items-start justify-between">
              <p className="text-base font-normal">Location</p>
              <p className="text-lg font-semibold">
                {dataMemo?.location ?? '-'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Card>
  );
};
