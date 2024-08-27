import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { FC } from 'react';
import { MdCheck } from 'react-icons/md';
import { isEmpty } from 'lodash';

import { GoogleIcon } from '@/assets/images';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { loadCookie } from '@/services/cookie';
import { useConfirmNotificationMutation } from '@/stores/ewsStore/ewsFloodStoreApi';
import { ErrorMessageBackendDataShape } from '@/types/api';
import { ESensorFloodEnum } from '@/types/api/ews/ewsFlood';
import { EStatusAlertEnum, TGatewayDevice } from '@/types/api/socket';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import { getSensorData } from '@/utils/functions/getSensorData';
import useDynamicLastUpdateTime from '@/utils/hooks/useDynamicLastUpdateTime';

dayjs.extend(duration);

type Props = {
  device: TGatewayDevice;
  setSelectedSensor: (e: keyof typeof ESensorFloodEnum) => void;
  selectedSensor: keyof typeof ESensorFloodEnum;
};

export const FloodInformationCard: FC<Props> = ({
  device,
  setSelectedSensor,
  selectedSensor,
}) => {
  const { status, location, sensorlog, userConfirmed, sensorcodeConfirmed } =
    device;

  const is_active = status === 1;
  const receivedOn = sensorlog?.receivedon;
  const userAlreadyConfirmed = !isEmpty(userConfirmed)
    ? userConfirmed.findIndex(
        (item) => item.username === loadCookie('username'),
      ) >= 0
    : false;

  // get time duration alert
  const timeDifference = dayjs().diff(receivedOn);
  const duration = dayjs.duration(timeDifference);
  const durationWaiting = duration.format('HH:mm:ss');

  // get last update
  const lastUpdateTime = useDynamicLastUpdateTime({ receivedOn });

  const [confirmNotification, { isLoading: isLoadingConfirmNotification }] =
    useConfirmNotificationMutation();

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
    setSelectedSensor(selectedSensor);
  };

  const convertSensorToRank = (sensor: string): number => {
    switch (sensor) {
      case 'temp':
        return 1;
      case 'hmdt':
        return 2;
      case 'smke':
        return 3;
      case 'lpg':
        return 4;
      case 'mthn':
        return 5;
      case 'co':
        return 6;
      case 'prpn':
        return 7;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {!isEmpty(sensorlog) &&
        sensorlog.data &&
        [...sensorlog.data]
          .sort((a, b) => {
            return (
              convertSensorToRank(b.sensorcode) -
              convertSensorToRank(a.sensorcode)
            );
          })
          .map((sensor, index) => {
            const { Icon, name } = getSensorData(sensor?.sensorcode);
            const getAlertBySensor = sensor.alert;
            const isCritical = sensor.alert?.threatlevel === 2;
            const isWarning = sensor.alert?.threatlevel === 1;

            return (
              <div className="flex justify-between" key={index}>
                <div className="flex items-center gap-1 truncate">
                  {Icon && <Icon size={15} className="flex-shrink-0" />}
                  <p className="text-rs-v2-white min-w-0 truncate">{name}</p>
                </div>
                {getAlertBySensor ? (
                  <p
                    className={cn(
                      isCritical && 'text-rs-v2-red',
                      isWarning && 'text-rs-alert-yellow',
                      !is_active && 'text-rs-v2-silver',
                    )}
                  >
                    <div className="flex items-center gap-1 truncate">
                      {is_active ? sensor?.value + ` ${sensor.unit}` : '-'}
                      <span className="text-white"> | </span>
                      <p className="text-rs-v2-white min-w-0 truncate">
                        {durationWaiting}
                      </p>
                      {sensorcodeConfirmed.find(
                        (item) => item === sensor.unit,
                      ) && (
                        <MdCheck size={16} className="text-rs-alert-green" />
                      )}
                    </div>
                  </p>
                ) : (
                  <p
                    className={cn(
                      'text-rs-alert-green',
                      !is_active && 'text-rs-v2-silver',
                    )}
                  >
                    {is_active ? sensor?.value + ` ${sensor.unit}` : '-'}
                  </p>
                )}
              </div>
            );
          })}
      <div className="my-2 bg-rs-v2-navy-blue p-2">
        <p className="text-center">Location</p>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <p>Location</p>
          <p>{location.name}</p>
        </div>
        <div className="flex justify-between">
          <p>Coordinate</p>
          <div className="flex items-center gap-1">
            <p className="text-right">
              {location.coordinate.lat}, {location.coordinate.lng}
            </p>
            <img
              src={GoogleIcon}
              alt="google-icon"
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                window.open(
                  `https://www.google.com/maps?q=${location.coordinate.lat},${location.coordinate.lng}`,
                  '_blank',
                );
              }}
            />
          </div>
        </div>
      </div>
      <p className="text-center text-xs font-semibold italic text-rs-neutral-chromium">
        {lastUpdateTime}
      </p>

      {device.alert_status !== EStatusAlertEnum.NORMAL &&
      userConfirmed &&
      userConfirmed.length > 0 ? (
        <p className="text-center text-xs font-semibold italic text-rs-neutral-chromium">
          Confirmed Alert by:{' '}
          {userConfirmed
            .map((item) => `${item.firstname} ${item.lastname}`)
            .join(', ')}
        </p>
      ) : (
        <></>
      )}

      {device.alert_status !== EStatusAlertEnum.NORMAL &&
      (!userConfirmed || userConfirmed.length < 3) &&
      !userAlreadyConfirmed ? (
        <button
          className={cn('my-2 cursor-pointer bg-rs-v2-midnight-blue p-2')}
          onClick={(e) => {
            e.stopPropagation();
            const sensorWithAlert = sensorlog.data.filter(
              (item) => item.alert !== null,
            );
            sensorWithAlert &&
              handleConfirmed(
                sensorWithAlert.map((item) => item.alert?.alertlog.id ?? 0),
              );
          }}
          disabled={isLoadingConfirmNotification}
        >
          <p className="text-center text-base">Confirm</p>
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};
