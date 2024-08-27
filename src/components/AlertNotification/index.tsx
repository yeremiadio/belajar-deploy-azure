import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TSocketNotif } from '@/types/api/socket';

import { getUrlDevice } from '@/utils/functions/getUrlDevice';
import { useWebSocketNotification } from '@/utils/hooks/useWebSocketNotification';

import { AlertCard } from './AlertCard';

export const AlertNotification: FC = () => {
  const [notifList, setNotifList] = useState<
    (TSocketNotif & { autoClose?: boolean })[]
  >([]);
  const { notif } = useWebSocketNotification();

  useEffect(() => {
    if (!notif) return;
    if (!!notif.resolvedon) return;
    setNotifList((prevNotif) => {
      const isDuplicate = prevNotif.some(
        (item) =>
          item.id === notif.id &&
          item.status === notif.status &&
          item.device.id === notif.device.id,
      );

      if (isDuplicate) {
        return prevNotif;
      }

      const newNotifList = [...prevNotif];

      if (notif.status === 'WARNING') {
        newNotifList.push({ ...notif, autoClose: true });
      } else {
        newNotifList.push(notif);
      }

      if (newNotifList.length > 3) {
        newNotifList.shift();
      }

      return newNotifList;
    });
  }, [notif]);

  const handleClose = (id: number) => {
    setNotifList((prevNotif) =>
      prevNotif.filter((prev) => {
        return prev.id !== id;
      }),
    );
  };

  const navigate = useNavigate();
  const handleGoToDeviceAlert = (notif: TSocketNotif) => {
    const { device } = notif;
    const permission = device?.gateway?.modules?.permission ?? '';
    const gatewayId = device?.gateway?.id ?? 0;
    const deviceId = device?.id ?? 0;
    const { url } = getUrlDevice(permission, gatewayId, deviceId);
    url && navigate(url);
  };

  return (
    <div className="fixed left-1/2 top-0 z-[1000] flex w-full -translate-x-1/2 flex-col-reverse lg:w-[60%]">
      {notifList.map((item) => (
        <AlertCard
          key={item.id}
          data={item}
          actionCheckDevice={() => {
            handleGoToDeviceAlert(item);
          }}
          actionClose={() => {
            handleClose(item.id);
          }}
        />
      ))}
    </div>
  );
};
