import { FC, useEffect, useRef } from 'react';
import { IoWarning } from 'react-icons/io5';
import { PiWarningCircleFill } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import { EStatusAlertEnum, TSocketNotif } from '@/types/api/socket';
import { getSensorData } from '@/utils/functions/getSensorData';

interface Props {
  data: TSocketNotif & { autoClose?: boolean };
  actionCheckDevice?: () => void;
  actionClose?: () => void;
}

export const AlertCard: FC<Props> = ({
  data,
  actionCheckDevice,
  actionClose,
}) => {
  const { status, message, device, sensor } = data;
  const { Icon } = getSensorData(sensor?.code);

  const notifRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const autoClose = data?.autoClose;

  useEffect(() => {
    if (!autoClose) return;

    const delay = setTimeout(() => {
      handleCloseWithAnimation();
    }, 10000);

    return () => {
      if (delay) clearTimeout(delay);
    };
  }, [autoClose]);

  useEffect(() => {
    // Animation when open
    notifRef?.current?.classList?.add('translate-y-[-300px]');
    notifRef?.current?.classList?.remove('border', 'py-3');
    const delay = setTimeout(() => {
      notifRef?.current?.classList?.add('border', 'py-3');
      notifRef?.current?.classList?.remove('translate-y-[-300px]');
      wrapperRef?.current?.classList?.add('grid-rows-[1fr]', 'mt-2');
    }, 200);

    return () => {
      if (delay) clearTimeout(delay);
    };
  }, [notifRef]);

  const handleCloseWithAnimation = () => {
    notifRef?.current?.classList?.remove('border', 'py-3');
    wrapperRef?.current?.classList?.remove('grid-rows-[1fr]', 'mt-2');

    const delay = setTimeout(() => {
      actionClose?.();
    }, 300);

    return () => {
      if (delay) clearTimeout(delay);
    };
  };

  return (
    <div
      ref={wrapperRef}
      className="grid grid-rows-[0fr] overflow-y-hidden transition-all duration-200 ease-in-out"
    >
      <div
        ref={notifRef}
        className={cn(
          'flex min-h-0 w-full items-center justify-between gap-4 rounded-lg border bg-black px-4 py-3 transition-all duration-200 ease-in-out',
          status === EStatusAlertEnum.CRITICAL && 'border-rs-alert-danger',
          status === EStatusAlertEnum.WARNING && 'border-rs-alert-yellow',
          `${device.id}`,
        )}
      >
        <div className="flex w-auto items-center gap-4">
          {status === EStatusAlertEnum.CRITICAL && (
            <PiWarningCircleFill className="h-10 w-10 text-rs-alert-danger" />
          )}
          {status === EStatusAlertEnum.WARNING && (
            <IoWarning className="h-10 w-10 text-rs-alert-yellow" />
          )}
          <div className="flex items-center gap-1">
            {Icon && (
              <Icon
                size={20}
                className={cn(
                  'flex-shrink-0',
                  status === EStatusAlertEnum.CRITICAL &&
                    'text-rs-alert-danger',
                  status === EStatusAlertEnum.WARNING && 'text-rs-alert-yellow',
                )}
              />
            )}
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
        <div className="flex w-fit items-center gap-4">
          <button
            className={cn(
              'cursor-pointer rounded-lg px-4 py-2 outline-none',
              status === EStatusAlertEnum.CRITICAL && 'bg-rs-alert-danger',
              status === EStatusAlertEnum.WARNING && 'bg-rs-alert-yellow',
            )}
            onClick={actionCheckDevice}
          >
            <span className="text-nowrap">Check Device</span>
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-lg px-4 py-2 outline-none"
            onClick={handleCloseWithAnimation}
          >
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
