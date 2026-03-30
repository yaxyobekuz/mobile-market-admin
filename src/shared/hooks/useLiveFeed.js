import { useEffect, useState, useCallback } from "react";
import { useSocket } from "./useSocket";

const AD_EVENTS = ["ad:received", "ad:processing", "ad:sent", "ad:failed", "ad:skipped"];
const MAX_EVENTS = 50;

/**
 * Collects real-time ad processing events from Socket.IO.
 * Maintains a rolling buffer of the last MAX_EVENTS events.
 */
export function useLiveFeed() {
  const { socket } = useSocket();
  const [events, setEvents] = useState([]);

  const addEvent = useCallback((type, data) => {
    setEvents((prev) => {
      const entry = { id: Date.now() + Math.random(), type, ...data, time: new Date() };
      const next = [entry, ...prev];
      return next.slice(0, MAX_EVENTS);
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handlers = {};
    AD_EVENTS.forEach((event) => {
      handlers[event] = (data) => addEvent(event, data);
      socket.on(event, handlers[event]);
    });

    return () => {
      AD_EVENTS.forEach((event) => socket.off(event, handlers[event]));
    };
  }, [socket, addEvent]);

  const clearEvents = useCallback(() => setEvents([]), []);

  return { events, clearEvents };
}
