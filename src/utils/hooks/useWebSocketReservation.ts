import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { loadCookie } from '@/services/cookie';

import { TReservationObject } from '@/types/api/reservation';

interface IReturnVal {
  reservationSocket: TReservationObject | null;
}

export const useWebSocketReservation = (): IReturnVal => {
  const companyId = loadCookie('companyId');
  const [reservationSocketResponse, setReservationSocketResponse] = useState<TReservationObject | null>(
    null,
  );

  useEffect(() => {
    const authToken = loadCookie('token');
    if (!authToken) return;
    if (!companyId) return;
    const socket = io(import.meta.env.VITE_ENDPOINT, {
      extraHeaders: {
        accesstoken: authToken,
      },
    });

    socket.emit('join', companyId);

    socket.on(`reservation-company-${companyId}`, (response) => {
      if (!response) return;
      setReservationSocketResponse(response);
    });

    return () => {
      socket.emit('leave', companyId);
      socket.disconnect();
    };
  }, [companyId]);

  return { reservationSocket: reservationSocketResponse };
};
