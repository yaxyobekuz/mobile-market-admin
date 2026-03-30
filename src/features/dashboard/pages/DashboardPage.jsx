import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Smartphone, TrendingUp, Zap, CheckCircle2 } from "lucide-react";
import { useAppQuery } from "@/shared/lib/query/query-hooks";
import { useSocket } from "@/shared/hooks/useSocket";
import { dashboardAPI, dashboardKeys } from "../api/dashboard.api";
import StatCard from "../components/StatCard";
import AdsAreaChart from "../components/AdsAreaChart";
import DevicePieChart from "../components/DevicePieChart";
import RecentAdsTable from "../components/RecentAdsTable";
import BotStatusCard from "../components/BotStatusCard";
import LiveFeedCard from "../components/LiveFeedCard";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const { data: summary } = useAppQuery({
    queryKey: dashboardKeys.list({ type: "summary" }),
    queryFn: () => dashboardAPI.getSummary(),
    refetchInterval: 60000,
  });

  const { data: dailyData } = useAppQuery({
    queryKey: dashboardKeys.list({ type: "daily", days: 30 }),
    queryFn: () => dashboardAPI.getDailyStats({ days: 30 }),
  });

  const { data: deviceData } = useAppQuery({
    queryKey: dashboardKeys.list({ type: "devices" }),
    queryFn: () => dashboardAPI.getDeviceStats({ days: 30 }),
  });

  // Real-time: refresh stats when a new ad is sent
  useEffect(() => {
    if (!socket) return;
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.list({ type: "summary" }) });
    };
    socket.on("stats:update", handler);
    return () => socket.off("stats:update", handler);
  }, [socket, queryClient]);

  const stats = summary?.data;

  // Calculate success rate
  const sent = stats?.statusBreakdown?.sent || 0;
  const failed = stats?.statusBreakdown?.failed || 0;
  const total = sent + failed;
  const successRate = total > 0 ? Math.round((sent / total) * 100) : 0;

  return (
    <div className="space-y-4 p-4 xs:p-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <StatCard
          title="Bugungi e'lonlar"
          value={stats?.today?.messages || 0}
          icon={Smartphone}
          gradient="from-emerald-400 to-emerald-600"
          subtitle="Bugun yuborilgan"
        />
        <StatCard
          title="Haftalik"
          value={stats?.week?.messages || 0}
          icon={TrendingUp}
          gradient="from-blue-400 to-blue-600"
          subtitle="So'nggi 7 kun"
        />
        <StatCard
          title="Muvaffaqiyat"
          value={`${successRate}%`}
          icon={CheckCircle2}
          gradient="from-purple-400 to-purple-600"
          subtitle={`${sent} yuborildi / ${failed} xato`}
        />
        <StatCard
          title="AI tokenlar"
          value={stats?.today?.tokens || 0}
          icon={Zap}
          gradient="from-amber-400 to-amber-600"
          subtitle="Bugun ishlatilgan"
        />
      </div>

      {/* Bot Status + Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BotStatusCard />
        <LiveFeedCard />
      </div>

      {/* Area Chart */}
      <AdsAreaChart data={dailyData?.data || []} />

      {/* Device + Recent Ads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DevicePieChart data={deviceData?.data || []} />
        <RecentAdsTable />
      </div>
    </div>
  );
};

export default DashboardPage;
