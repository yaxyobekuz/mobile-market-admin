import { Wifi, WifiOff, Clock, ListOrdered, Radio } from "lucide-react";
import { useBotStatus } from "@/shared/hooks/useBotStatus";

function formatUptime(seconds) {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}s ${m}d`;
  return `${m} daqiqa`;
}

const BotStatusCard = () => {
  const { connected, uptime, queueSize, monitoredChannels, wsConnected } = useBotStatus();

  return (
    <div className="bg-white rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Bot holati</p>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${connected ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
          {connected ? "Ulangan" : "O'chiq"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-400">
            <Radio size={11} />
            <span className="text-xs">Kanallar</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{monitoredChannels}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-400">
            <ListOrdered size={11} />
            <span className="text-xs">Navbat</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{queueSize}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-gray-400">
            <Clock size={11} />
            <span className="text-xs">Uptime</span>
          </div>
          <p className="text-base font-bold text-gray-900">{formatUptime(uptime)}</p>
        </div>
      </div>

      {!wsConnected && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <WifiOff size={11} />
          Real-time ulanish yo'q
        </p>
      )}
    </div>
  );
};

export default BotStatusCard;
