import { FC, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { DeviceCard } from '@/components/DeviceCard';
import { cn } from '@/lib/utils';
import { selectToggleCopilot } from '@/stores/copilotStore/toggleCopilotSlice';
import {
  updateEnergyMeterQueryData,
  useGetEnergyMeterDevicesQuery,
} from '@/stores/energyMeterStore/energyMeterStoreApi';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { EStatusAlertEnum } from '@/types/api/socket';
import { ROUTES } from '@/utils/configs/route';
import { convertAlertStatusToRank } from '@/utils/functions/convertAlertStatusToRank';
import { localization } from '@/utils/functions/localization';
import useAppDispatch from '@/utils/hooks/useAppDispatch';
import useAppSelector from '@/utils/hooks/useAppSelector';
import { useWebSocketGateway } from '@/utils/hooks/useWebSocketGateway';

interface Props {}

export const DeviceList: FC<Props> = () => {
  const navigate = useNavigate();
  const language = useAppSelector(selectLanguage);
  const toggleCopilot = useAppSelector(selectToggleCopilot);

  const { pathname } = useLocation();
  const { gatewayId } = useParams<'gatewayId'>();

  const { data } = useGetEnergyMeterDevicesQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });

  // websocket
  const { gatewayDevice } = useWebSocketGateway({
    gatewayId: Number(gatewayId),
  });

  const dispatch = useAppDispatch();

  // re-assign value websocket to redux
  useEffect(() => {
    if (!gatewayDevice || !gatewayId) return;

    // api/energy-meter/devices
    dispatch(
      updateEnergyMeterQueryData(
        'getEnergyMeterDevices',
        { gatewayId: Number(gatewayId) },
        (ret) => {
          ret.forEach((dev, idx, arr) => {
            if (dev.id === gatewayDevice.id) {
              Object.assign(arr[idx], gatewayDevice);
            }
          });

          // sort by alert_status
          ret.sort((a, b) => {
            const statusA = convertAlertStatusToRank(
              a.alert_status as EStatusAlertEnum,
            );
            const statusB = convertAlertStatusToRank(
              b.alert_status as EStatusAlertEnum,
            );
            return statusA - statusB;
          });
        },
      ),
    );
  }, [gatewayDevice, gatewayId]);

  return (
    <div className="box-border flex h-[300px] flex-col overflow-hidden rounded-xl p-6 pb-0 pt-0 md:col-span-3 md:pt-6 xl:h-auto">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h1 className="text-lg font-medium text-rs-neutral-silver-lining md:text-xl 2xl:text-2xl">
            {localization('Device List', language)}
          </h1>
          <p className="mt-2 text-sm md:text-base 2xl:text-lg">
            {localization('You have', language)} {data?.length ?? 0}{' '}
            {localization('Device(s)', language)},{' '}
            {
              data?.filter(
                (item) =>
                  item.alert_status === EStatusAlertEnum.CRITICAL &&
                  item.status === 1,
              ).length
            }{' '}
            <span className="font-bold text-rs-v2-red">
              {localization('Critical', language)}
            </span>
            {' | '}
            {
              data?.filter(
                (item) =>
                  item.alert_status === EStatusAlertEnum.WARNING &&
                  item.status === 1,
              ).length
            }{' '}
            <span className="font-bold text-rs-alert-yellow">
              {localization('Warning', language)}
            </span>
            {data?.filter((item) => item.status === 0).length}{' '}
            <span className="font-bold text-rs-neutral-chromium">
              {localization('Inactive', language)}
            </span>
          </p>
        </div>
        <span
          className="cursor-pointer whitespace-nowrap text-[10px] font-semibold text-rs-v2-mint underline md:text-xs xl:text-base"
          onClick={() => {
            navigate(
              gatewayId
                ? pathname.includes('advanced')
                  ? ROUTES.energyMeterAdvancedGatewayDevices(gatewayId)
                  : ROUTES.energyMeterGatewayDevices(gatewayId)
                : pathname.includes('advanced')
                  ? ROUTES.energyMeterAdvancedDevices
                  : ROUTES.energyMeterDevices,
            );
          }}
        >
          {localization('See all', language)}
        </span>
      </div>

      <div
        className={cn(
          'mt-6 box-border flex h-full w-full flex-wrap gap-y-4 overflow-hidden overflow-y-auto md:gap-4',
        )}
      >
        {data &&
          data?.map((item, index) => (
            <DeviceCard
              key={index}
              data={item}
              className={cn(
                'w-full',
                toggleCopilot
                  ? 'xl:w-[calc(25%_-_16px)]'
                  : 'xl:w-[calc(20%_-_20px)]',
              )}
            />
          ))}
      </div>
    </div>
  );
};
