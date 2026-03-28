// Pages — Auth
import LoginPage from "@/features/auth/pages/LoginPage";

// Pages — Dashboard
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

// Pages — Advertisements
import AdvertisementsPage from "@/features/advertisements/pages/AdvertisementsPage";
import AdvertisementDetailPage from "@/features/advertisements/pages/AdvertisementDetailPage";

// Pages — Channels
import ChannelsPage from "@/features/channels/pages/ChannelsPage";

// Pages — Devices
import DevicesPage from "@/features/devices/pages/DevicesPage";

// Pages — Bot Settings
import BotSettingsPage from "@/features/bot-settings/pages/BotSettingsPage";

// Pages — Statistics
import StatisticsPage from "@/features/statistics/pages/StatisticsPage";

// Guards
import AuthGuard from "@/shared/components/guards/AuthGuard";
import GuestGuard from "@/shared/components/guards/GuestGuard";

// Layouts
import DashboardLayout from "@/shared/layouts/DashboardLayout";

// Router
import { Routes as RoutesWrapper, Route, Navigate } from "react-router-dom";

const Routes = () => {
  return (
    <RoutesWrapper>
      {/* Guest only routes */}
      <Route element={<GuestGuard />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/advertisements" element={<AdvertisementsPage />} />
          <Route path="/advertisements/:id" element={<AdvertisementDetailPage />} />
          <Route path="/channels" element={<ChannelsPage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/bot-settings" element={<BotSettingsPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RoutesWrapper>
  );
};

export default Routes;
