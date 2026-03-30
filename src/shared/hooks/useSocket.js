import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:6002";

let sharedSocket = null;
let connectionCount = 0;

/**
 * Returns a shared Socket.IO connection.
 * The connection is created once and reused across all components.
 */
export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    connectionCount++;

    if (!sharedSocket) {
      sharedSocket = io(WS_URL, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });
    }

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    sharedSocket.on("connect", onConnect);
    sharedSocket.on("disconnect", onDisconnect);

    if (sharedSocket.connected) {
      setIsConnected(true);
    }

    return () => {
      sharedSocket.off("connect", onConnect);
      sharedSocket.off("disconnect", onDisconnect);
      connectionCount--;
      if (connectionCount === 0 && sharedSocket) {
        sharedSocket.disconnect();
        sharedSocket = null;
      }
    };
  }, []);

  return { socket: sharedSocket, isConnected };
}
