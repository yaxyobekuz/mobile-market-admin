import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

const DEFAULT_STATUS = {
  connected: false,
  uptime: 0,
  queueSize: 0,
  monitoredChannels: 0,
};

/**
 * Subscribes to real-time bot status from Socket.IO.
 * Falls back to disconnected state if WebSocket is unavailable.
 */
export function useBotStatus() {
  const { socket, isConnected } = useSocket();
  const [status, setStatus] = useState(DEFAULT_STATUS);

  useEffect(() => {
    if (!socket) return;

    const handler = (data) => setStatus(data);
    socket.on("bot:status", handler);

    return () => socket.off("bot:status", handler);
  }, [socket]);

  return { ...status, wsConnected: isConnected };
}
