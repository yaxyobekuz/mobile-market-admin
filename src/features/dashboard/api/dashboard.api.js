import http from "@/shared/api/http";
import { createQueryKeys } from "@/shared/lib/query/query-keys";

export const dashboardKeys = createQueryKeys("dashboard");

export const dashboardAPI = {
  getSummary: () => http.get("/api/stats/dashboard"),
  getDailyStats: (params) => http.get("/api/stats/daily", { params }),
  getDeviceStats: (params) => http.get("/api/stats/devices", { params }),
};
