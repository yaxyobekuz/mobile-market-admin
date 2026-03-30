import { useEffect, useRef } from "react";
import { useLiveFeed } from "@/shared/hooks/useLiveFeed";
import { Activity, CheckCircle2, XCircle, SkipForward, Loader2, Radio } from "lucide-react";

const EVENT_CONFIG = {
  "ad:received": {
    label: "Qabul qilindi",
    icon: Radio,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  "ad:processing": {
    label: "Formatlanmoqda",
    icon: Loader2,
    color: "text-amber-500",
    bg: "bg-amber-50",
    spin: true,
  },
  "ad:sent": {
    label: "Yuborildi",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  "ad:failed": {
    label: "Xato",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  "ad:skipped": {
    label: "O'tkazib yuborildi",
    icon: SkipForward,
    color: "text-gray-400",
    bg: "bg-gray-50",
  },
};

function formatTime(date) {
  return new Date(date).toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const LiveFeedCard = () => {
  const { events, clearEvents } = useLiveFeed();
  const bottomRef = useRef(null);

  // Auto-scroll sadece yeni event gelmisse
  useEffect(() => {
    if (events.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [events.length]);

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col" style={{ minHeight: 280 }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-gray-500" />
          <p className="text-sm font-medium text-gray-700">Live Feed</p>
          {events.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </div>
        {events.length > 0 && (
          <button
            onClick={clearEvents}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Tozalash
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 max-h-52">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 py-8">
            <Activity size={28} className="mb-2" />
            <p className="text-xs">E'lonlar kutilmoqda...</p>
          </div>
        ) : (
          [...events].reverse().map((event) => {
            const cfg = EVENT_CONFIG[event.type] || EVENT_CONFIG["ad:received"];
            const Icon = cfg.icon;
            return (
              <div key={event.id} className="flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon size={12} className={`${cfg.color} ${cfg.spin ? "animate-spin" : ""}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                    {event.deviceLabel && (
                      <span className="text-xs text-gray-500">{event.deviceLabel}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {event.channel && (
                      <span className="text-xs text-gray-400 truncate">{event.channel}</span>
                    )}
                    {event.error && (
                      <span className="text-xs text-red-400 truncate">{event.error}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-300 flex-shrink-0">{formatTime(event.time)}</span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default LiveFeedCard;
