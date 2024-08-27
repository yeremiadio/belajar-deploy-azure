import { loadCookie } from '@/services/cookie';
import { TSocketGateway } from '@/types/api/socket';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface Props {
  gatewayId: number;
}

interface IReturnVal {
  gatewayDevice: TSocketGateway | null;
}

export const useWebSocketGateway = ({ gatewayId }: Props): IReturnVal => {
  const [gatewayResponse, setGatewayResponse] = useState<TSocketGateway | null>(
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
    socket.on(`gateway-${gatewayId}`, (response) => {
      if (!response) return;
      setGatewayResponse(response);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.emit('leave', gatewayId);
      socket.disconnect();
    };
  }, [gatewayId]);

  return { gatewayDevice: gatewayResponse };
};
