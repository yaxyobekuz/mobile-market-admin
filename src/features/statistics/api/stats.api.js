import http from "@/shared/api/http";
import { createQueryKeys } from "@/shared/lib/query/query-keys";

export const statsKeys = createQueryKeys("stats");

export const statsAPI = {
  getDailyStats: (params) => http.get("/api/stats/daily", { params }),
  getDeviceStats: (params) => http.get("/api/stats/devices", { params }),
  getDashboard: () => http.get("/api/stats/dashboard"),
};
