import { loadCookie } from '@/services/cookie';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function WebSocketTestPage() {
  const [gatewayDevice, setGatewayDevice] = useState(null);
  const [notif, setNotif] = useState(null);

  const authToken = loadCookie('token');
  const gatewayId = 237; // Replace with your actual gatewayId

  useEffect(() => {
    if (!authToken) return;
    // Connect to the socket
    const socket = io(import.meta.env.VITE_ENDPOINT, {
      extraHeaders: {
        accesstoken: authToken,
      },
    });
    console.log({ socket });

    // Join the gateway
    socket.emit('join', gatewayId);

    // Listen for gateway-specific messages
    socket.on(`gateway-${gatewayId}`, (response) => {
      if (!response) return;
      setGatewayDevice(response); // Update the state with the new gatewayDevice
    });

    // Listen for notifications
    socket.on('notif', (response) => {
      if (!response) return;
      setNotif(response); // Update the state with the alert message
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.emit('leave', gatewayId);
      socket.disconnect();
    };
  }, []);
  console.log({ gatewayDevice });
  console.log({ notif });

  return (
    <div className="h-full w-full">
      <p>websocket-test</p>
    </div>
  );
}
