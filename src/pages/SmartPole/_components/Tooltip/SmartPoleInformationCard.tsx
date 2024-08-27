import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FC } from 'react';

import { cn } from '@/lib/utils';

import { getSensorData } from '@/utils/functions/getSensorData';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import useDynamicLastUpdateTime from '@/utils/hooks/useDynamicLastUpdateTime';

import {
  EStatusAlertEnum,
  TGatewayDevice,
  TSensorData,
} from '@/types/api/socket';
import { ErrorMessageBackendDataShape } from '@/types/api';

import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

import { GoogleIcon } from '@/assets/images';

import { useConfirmSmartpoleNotificationMutation } from '@/stores/smartPoleStore/smartPoleStoreApi';
import { loadCookie } from '@/services/cookie';
import useDynamicTime from '@/utils/hooks/useDynamicTime';

dayjs.extend(duration);

type Props = {
  isOverThreshold: boolean;
  deviceData: TGatewayDevice;
  selectedSensor?: string;
  setSelectedSensor: (e: string) => void;
};

const SmartPoleInformationCard: FC<Props> = ({
  deviceData,
  setSelectedSensor,
  selectedSensor,
}) => {
  const isDeviceActive = deviceData?.status === 1;
  const userConfirmed = deviceData?.userConfirmed;
  const lastUpdateTime = useDynamicLastUpdateTime({
    receivedOn: deviceData?.sensorlog?.receivedon,
  });
  const userAlreadyConfirmed =
    userConfirmed?.findIndex(
      (item) => item?.username === loadCookie('username'),
    ) >= 0;

  const [confirmNotification, { isLoading: isLoadingConfirmNotification }] =
    useConfirmSmartpoleNotificationMutation();

  const handleConfirmed = async (ids: Array<number>) => {
    await confirmNotification({ ids })
      .unwrap()
      .then(() => {
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: 'Confirmed Notification',
            variant: 'success',
          }),
        );
      })
      .catch((error: ErrorMessageBackendDataShape) => {
        toast(
          generateDynamicToastMessage({
            title: 'Failed',
            description: `Failed confirm notification ${error?.data?.message ?? ''}`,
            variant: 'error',
          }),
        );
      });

    // assume selectedSensor had been cleared when button clicked & need re-select
    setSelectedSensor(selectedSensor ?? '');
  };

  return (
    <div className="flex flex-col gap-2">
      {deviceData?.sensorlog?.data?.map((sensor, index) => {
        const { Icon, name, unit } = getSensorData(sensor?.sensorcode);
        const getAlertBySensor = sensor?.alert;

        return (
          <div className="flex justify-between" key={index}>
            <div className="flex items-center gap-1 truncate">
              {Icon && <Icon size={15} className="flex-shrink-0" />}
              <p className="text-rs-v2-white min-w-0 truncate">{name}</p>
            </div>
            {getAlertBySensor ? (
              <p
                className={cn(
                  'text-rs-v2-red',
                  !isDeviceActive && 'text-rs-v2-silver',
                )}
              >
                <div className="flex items-center gap-1 truncate font-semibold">
                  {isDeviceActive
                    ? sensor?.value + ` ${sensor?.unit ?? unit}`
                    : '-'}
                  <span className="text-white"> | </span>
                  <DurationWaiting
                    startTime={sensor?.alert?.alertlog?.receivedon}
                  />
                </div>
              </p>
            ) : (
              <p
                className={cn(
                  'text-rs-alert-green',
                  !isDeviceActive && 'text-rs-v2-silver',
                  !sensor?.value && 'text-rs-v2-white',
                  'font-semibold',
                )}
              >
                {isDeviceActive && !!sensor?.value
                  ? sensor?.value + ` ${sensor?.unit ?? unit}`
                  : '-'}
              </p>
            )}
          </div>
        );
      })}
      <p className="my-1.5 bg-rs-v2-navy-blue py-1.5 text-center">Location</p>
      <div className="flex justify-between text-xs">
        <p>Location</p>
        <p className="text-right font-semibold">
          {deviceData?.location?.name ?? '-'}
        </p>
      </div>
      <div className="flex justify-between">
        <p>Coordinate</p>
        <div className="flex items-center gap-1">
          <p className="text-right font-semibold">
            {deviceData?.location?.coordinate?.lat},{' '}
            {deviceData?.location?.coordinate?.lat}
          </p>
          <img
            src={GoogleIcon}
            alt="google-icon"
            className="h-4 w-4 cursor-pointer"
            onClick={() => {
              window.open(
                `https://www.google.com/maps?q=${deviceData?.location?.coordinate?.lat},${deviceData?.location?.coordinate?.lng}`,
                '_blank',
              );
            }}
          />
        </div>
      </div>
      <p className="mt-2 text-center text-xs font-semibold italic text-rs-neutral-chromium">
        {lastUpdateTime}
      </p>
      {deviceData?.alert_status !== EStatusAlertEnum.NORMAL &&
      userConfirmed &&
      userConfirmed?.length > 0 ? (
        <p className="text-center text-xs font-semibold italic text-rs-neutral-chromium">
          Confirmed Alert by:{' '}
          {userConfirmed
            .map((item) => `${item?.firstname} ${item?.lastname}`)
            .join(', ')}
        </p>
      ) : (
        <></>
      )}

      {deviceData?.alert_status !== EStatusAlertEnum.NORMAL &&
      (!userConfirmed || userConfirmed.length < 3) &&
      !userAlreadyConfirmed ? (
        <Button
          type="button"
          className="btn-secondary-midnight-blue hover:hover-btn-secondary-midnight-blue disabled:disabled-btn-disabled-slate-blue"
          onClick={(e) => {
            e.stopPropagation();
            const sensorWithAlert: TSensorData[] =
              deviceData?.sensorlog?.data?.filter(
                (item) => item.alert !== null,
              );
            sensorWithAlert &&
              handleConfirmed(
                sensorWithAlert.map((item) => item.alert?.alertlog?.id ?? 0),
              );
          }}
          disabled={isLoadingConfirmNotification}
        >
          <p className="text-center text-base">Confirm</p>
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
};

const DurationWaiting = ({ startTime }: { startTime?: string }) => {
  const durationWaiting = useDynamicTime(startTime, true);

  return <p className="text-rs-v2-white min-w-0 truncate">{durationWaiting}</p>;
};

export default SmartPoleInformationCard;
