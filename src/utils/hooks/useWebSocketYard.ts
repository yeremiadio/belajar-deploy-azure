import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { loadCookie } from '@/services/cookie';

import { TReservationObject } from '@/types/api/reservation';

interface Props {
  gatewayId: number;
}

interface IReturnVal {
  yardSocket: TReservationObject | null;
}

export const useWebSocketYard = ({ gatewayId }: Props): IReturnVal => {
  const [yardSocketResponse, setYardSocketResponse] = useState<TReservationObject | null>(
    null,
  );

  useEffect(() => {
    const authToken = loadCookie('token');
    if (!authToken) return;
    if (!gatewayId) return;
    // Connect to the socket
    const socket = io(import.meta.env.VITE_ENDPOINT, {
      extraHeaders: {
        accesstoken: authToken,
      },
    });

    // Join the gateway
    socket.emit('join', gatewayId);

    // Listen for gateway-specific messages
    socket.on(`yard-${gatewayId}`, (response) => {
      if (!response) return;
      setYardSocketResponse(response);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.emit('leave', gatewayId);
      socket.disconnect();
    };
  }, [gatewayId]);

  return { yardSocket: yardSocketResponse };
};
