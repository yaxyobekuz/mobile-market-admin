import { Smartphone, TrendingUp, Zap, BarChart3 } from "lucide-react";
import { useAppQuery } from "@/shared/lib/query/query-hooks";
import { dashboardAPI, dashboardKeys } from "../api/dashboard.api";
import StatCard from "../components/StatCard";
import AdsAreaChart from "../components/AdsAreaChart";
import DevicePieChart from "../components/DevicePieChart";
import RecentAdsTable from "../components/RecentAdsTable";

const DashboardPage = () => {
  const { data: summary } = useAppQuery({
    queryKey: dashboardKeys.list({ type: "summary" }),
    queryFn: () => dashboardAPI.getSummary(),
  });

  const { data: dailyData } = useAppQuery({
    queryKey: dashboardKeys.list({ type: "daily", days: 30 }),
    queryFn: () => dashboardAPI.getDailyStats({ days: 30 }),
  });

  const { data: deviceData } = useAppQuery({
    queryKey: dashboardKeys.list({ type: "devices" }),
    queryFn: () => dashboardAPI.getDeviceStats({ days: 30 }),
  });

  const stats = summary?.data;

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
          title="Jami e'lonlar"
          value={stats?.total || 0}
          icon={BarChart3}
          gradient="from-purple-400 to-purple-600"
          subtitle="Barcha vaqt"
        />
        <StatCard
          title="AI tokenlar"
          value={stats?.today?.tokens || 0}
          icon={Zap}
          gradient="from-amber-400 to-amber-600"
          subtitle="Bugun ishlatilgan"
        />
      </div>

      {/* Charts */}
      <AdsAreaChart data={dailyData?.data || []} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DevicePieChart data={deviceData?.data || []} />
        <RecentAdsTable />
      </div>
    </div>
  );
};

export default DashboardPage;
