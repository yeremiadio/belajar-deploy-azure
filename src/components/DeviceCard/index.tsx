import { FC, HTMLAttributes } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { EStatusAlertEnum, TGatewayDevice } from '@/types/api/socket';
import { ROUTES } from '@/utils/configs/route';
import useDynamicLastUpdateTime from '@/utils/hooks/useDynamicLastUpdateTime';

interface Props {
  data: TGatewayDevice;
  isShownDetail?: (device_id: number) => void;
  selectedDeviceId?: number;
}

export const DeviceCard: FC<Props & HTMLAttributes<HTMLDivElement>> = ({
  data,
  isShownDetail,
  selectedDeviceId,
  className,
  ...rest
}) => {
  const navigate = useNavigate();
  const { gatewayId } = useParams<'gatewayId'>();
  const { pathname } = useLocation();

  const { id, status, name, sensorlog, alert_status } = data;
  const is_active = status === 1;
  const selectedDevice = selectedDeviceId && selectedDeviceId === id;

  const total_usage =
    sensorlog?.data.find((item) => item.sensorcode === 'edel')?.value ?? null;
  const receivedOn = sensorlog?.receivedon;
  const lastUpdateTime = useDynamicLastUpdateTime({ receivedOn });

  return (
    <div
      className={cn(
        `box-border overflow-hidden rounded-xl bg-rs-v2-galaxy-blue px-4 py-3`,
        !is_active && 'cursor-not-allowed bg-rs-v2-navy-blue',
        alert_status === EStatusAlertEnum.CRITICAL && 'bg-rs-v2-red-bg',
        alert_status === EStatusAlertEnum.WARNING && 'bg-rs-alert-bg-yellow',
        selectedDevice && 'border-[3px] border-white',
        isShownDetail && 'cursor-pointer',
        className,
      )}
      {...rest}
      onClick={(e) => {
        e.stopPropagation();
        if (!is_active) return;
        
        if (gatewayId) {
          navigate(
            pathname.includes('advanced')
              ? `${ROUTES.energyMeterAdvancedGatewayDevices(gatewayId)}?device=${id}`
              : `${ROUTES.energyMeterGatewayDevices(gatewayId)}?device=${id}`,
          );
        } else {
          navigate(
            pathname.includes('advanced')
              ? `${ROUTES.energyMeterAdvancedDevices}?device=${id}`
              : `${ROUTES.energyMeterDevices}?device=${id}`,
          );
        }

        isShownDetail && isShownDetail(id);
      }}
    >
      <div className="flex justify-between">
        <h3 className="text-xs font-medium md:text-sm 2xl:text-base">{name}</h3>
        <div className="flex items-center gap-1">
          <div
            className={cn(
              ` h-4 w-4 rounded-full`,
              is_active ? 'bg-rs-v2-mint' : 'bg-rs-neutral-nero',
            )}
          />
          <span className="text-xs font-medium">
            {is_active ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
      <h1
        className={cn(
          `mt-2 text-2xl font-semibold text-rs-v2-mint md:text-3xl 2xl:text-4xl`,
          !is_active && 'text-rs-v2-grey-disable',
          alert_status === EStatusAlertEnum.CRITICAL && 'text-rs-v2-red',
          alert_status === EStatusAlertEnum.WARNING && 'text-rs-alert-yellow',
        )}
      >
        {is_active ? total_usage : '-'}{' '}
        <span className="text-sm md:text-base 2xl:text-lg">kwH</span>
      </h1>
      <i className="mt-2 text-[10px] font-bold text-rs-neutral-chromium">
        {lastUpdateTime}
      </i>
    </div>
  );
};
