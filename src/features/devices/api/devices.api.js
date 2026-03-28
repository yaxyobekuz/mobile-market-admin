import http from "@/shared/api/http";
import { createQueryKeys } from "@/shared/lib/query/query-keys";

export const devicesKeys = createQueryKeys("devices");

export const devicesAPI = {
  getAll: () => http.get("/api/devices"),
  create: (data) => http.post("/api/devices", data),
  update: (id, data) => http.put(`/api/devices/${id}`, data),
  delete: (id) => http.delete(`/api/devices/${id}`),
};
