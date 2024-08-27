import { loadCookie } from "@/services/cookie";
import {
    TSocketNotif,
} from "@/types/api/socket";
import { useEffect, useState } from "react";
import io from 'socket.io-client';

interface IReturnVal {
    notif: TSocketNotif | null
}

export const useWebSocketNotification = (): IReturnVal => {
    const [notif, setNotif] = useState<TSocketNotif | null>(null);

    const authToken = loadCookie('token');

    useEffect(() => {
        if (!authToken) return;

        // Connect to the socket
        const socket = io(import.meta.env.VITE_ENDPOINT, {
            extraHeaders: {
                accesstoken: authToken,
            },
        });

        // Listen for notifications
        socket.on('notif', (response) => {
            if (!response) return
            setNotif(response);
        });

        // Clean up the socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    return { notif }
}