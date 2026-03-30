import { useState } from "react";
import { useAppQuery } from "@/shared/lib/query/query-hooks";
import { statsAPI, statsKeys } from "../api/stats.api";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/button/Button";
import DailyChart from "../components/DailyChart";
import DeviceBarChart from "../components/DeviceBarChart";
import TokenUsageChart from "../components/TokenUsageChart";

const TABS = [
  { key: 7, label: "Hafta" },
  { key: 30, label: "Oy" },
  { key: 90, label: "3 Oy" },
];

const StatisticsPage = () => {
  const [days, setDays] = useState(30);

  const { data: dailyData, isLoading: dailyLoading } = useAppQuery({
    queryKey: statsKeys.list({ type: "daily", days }),
    queryFn: () => statsAPI.getDailyStats({ days }),
  });

  const { data: deviceData, isLoading: deviceLoading } = useAppQuery({
    queryKey: statsKeys.list({ type: "devices", days }),
    queryFn: () => statsAPI.getDeviceStats({ days }),
  });

  const { data: channelData } = useAppQuery({
    queryKey: statsKeys.list({ type: "channels", days }),
    queryFn: () => statsAPI.getChannelStats({ days }),
  });

  const daily = dailyData?.data || [];
  const devices = deviceData?.data || [];
  const channelStats = channelData?.data || [];

  const totalSent = daily.reduce((s, d) => s + (d.sent || 0), 0);
  const totalFailed = daily.reduce((s, d) => s + (d.failed || 0), 0);
  const totalSkipped = daily.reduce((s, d) => s + (d.skipped || 0), 0);
  const totalTokens = daily.reduce((s, d) => s + (d.totalTokensUsed || 0), 0);
  const totalAll = totalSent + totalFailed + totalSkipped || 1;

  return (
    <div className="space-y-4 p-4 xs:p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Statistika</h1>
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              variant={days === tab.key ? "default" : "outline"}
              onClick={() => setDays(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          label="Yuborilgan"
          value={totalSent}
          percent={((totalSent / totalAll) * 100).toFixed(1)}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <SummaryCard
          label="Xato"
          value={totalFailed}
          percent={((totalFailed / totalAll) * 100).toFixed(1)}
          color="text-red-600"
          bg="bg-red-50"
        />
        <SummaryCard
          label="O'tkazilgan"
          value={totalSkipped}
          percent={((totalSkipped / totalAll) * 100).toFixed(1)}
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <SummaryCard
          label="Tokenlar"
          value={totalTokens.toLocaleString()}
          color="text-violet-600"
          bg="bg-violet-50"
        />
      </div>

      {/* Daily Trend */}
      <Card title="Kunlik trend">
        <div className="mt-3">
          {dailyLoading ? (
            <p className="text-gray-400 text-sm py-8 text-center">Yuklanmoqda...</p>
          ) : (
            <DailyChart data={daily} />
          )}
        </div>
      </Card>

      {/* Device Breakdown + Token Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Qurilmalar bo'yicha">
          <div className="mt-3">
            {deviceLoading ? (
              <p className="text-gray-400 text-sm py-8 text-center">Yuklanmoqda...</p>
            ) : (
              <DeviceBarChart data={devices} />
            )}
          </div>
        </Card>
        <Card title="Token ishlatilishi">
          <div className="mt-3">
            {dailyLoading ? (
              <p className="text-gray-400 text-sm py-8 text-center">Yuklanmoqda...</p>
            ) : (
              <TokenUsageChart data={daily} />
            )}
          </div>
        </Card>
      </div>

      {/* Per-Channel Stats */}
      {channelStats.length > 0 && (
        <Card title="Kanallar bo'yicha">
          <div className="mt-3 divide-y divide-gray-50">
            {channelStats.map((ch) => (
              <div key={ch.channel} className="flex items-center gap-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{ch.channel}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ch.sent} yuborildi · {ch.failed} xato · {ch.skipped} o'tkazildi
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${ch.successRate}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-10 text-right">
                    {ch.successRate}%
                  </span>
                  <span className="text-xs text-gray-400 w-8 text-right">{ch.total}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, percent, color, bg }) => (
  <div className={`${bg} rounded-xl p-4`}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
    {percent !== undefined && (
      <p className="text-xs text-gray-400 mt-0.5">{percent}%</p>
    )}
  </div>
);

export default StatisticsPage;
