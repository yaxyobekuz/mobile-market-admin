import http from "@/shared/api/http";
import { createQueryKeys } from "@/shared/lib/query/query-keys";

export const adsKeys = createQueryKeys("advertisements");

export const adsAPI = {
  getAll: (params) => http.get("/api/advertisements", { params }),
  getById: (id) => http.get(`/api/advertisements/${id}`),
  delete: (id) => http.delete(`/api/advertisements/${id}`),
  getStats: () => http.get("/api/advertisements/stats"),
};
