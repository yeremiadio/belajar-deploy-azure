import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Card from '@/components/Card';
import Spinner from '@/components/Spinner';

import { cn } from '@/lib/utils';

import { DeviceInformationCard } from '@/pages/Waste/_components/DeviceList';
import LiquidChartCard from '@/pages/Waste/_components/WasteChart/LiquidChart';
import { DeviceEmptyCard } from '@/pages/Waste/_components/DeviceList/DeviceEmptyCard';

import {
  updateWasteMonitoringQueryData,
  useGetWasteMonitoringListQuery,
} from '@/stores/wasteMonitoringStore';

import { EWasteTypeEnum } from '@/types/api/wasteMonitoring';

import useAppDispatch from '@/utils/hooks/useAppDispatch';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';

type Props = {};

const LiquidCard: FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { gatewayId } = useParams<'gatewayId'>();

  const { data: deviceList, isLoading: isLoadingDeviceList } =
    useGetWasteMonitoringListQuery({
      gatewayId: Number(gatewayId),
      type: EWasteTypeEnum.LIQUID,
    });

  const deviceIds = deviceList && deviceList.map((item) => item.id);

  // websocket
  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  const isLoading = isLoadingDeviceList;

  // re-assign value websocket to redux
  useEffect(() => {
    if (!gatewayDevice || !gatewayId) return;
    dispatch(
      updateWasteMonitoringQueryData(
        'getWasteMonitoringList',
        { gatewayId: Number(gatewayId) },
        (ret) => {
          ret.forEach((dev, idx, arr) => {
            if (dev.id === gatewayDevice.id) {
              Object.assign(arr[idx], gatewayDevice);
            }
          });
        },
      ),
    );
  }, [gatewayDevice, gatewayId]);

  return (
    <Card
      className={cn(
        'relative box-border h-fit cursor-pointer bg-rs-v2-slate-blue-60% ',
      )}
    >
      <div className="items-center px-3 py-5 font-bold text-center">
        Liquid Waste
      </div>
      {isLoading ? (
        <Spinner isFullWidthAndHeight={false} containerClassName="flex-grow" />
      ) : (
        <div>
          <div className="relative box-border flex justify-center items-center overflow-hidden">
            <div className="relative p-5 w-full h-full">
              <LiquidChartCard
                deviceIds={deviceIds ?? []}
                gatewayDevice={gatewayDevice}
                deviceList={deviceList ?? []}
              />
            </div>
          </div>
          <p className="px-5">List Device</p>
          <div className="flex flex-col mb-5 w-full h-[250px] overflow-y-auto">
            <div className="px-5 py-3">
              {deviceList?.map((item) => {
                return item.sensorlog ? (
                  <DeviceInformationCard key={item.id} devices={item} />
                ) : (
                  <DeviceEmptyCard key={item.id} devices={item} />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default LiquidCard;
