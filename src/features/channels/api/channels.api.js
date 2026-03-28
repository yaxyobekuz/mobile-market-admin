import http from "@/shared/api/http";
import { createQueryKeys } from "@/shared/lib/query/query-keys";

export const channelsKeys = createQueryKeys("channels");

export const channelsAPI = {
  getAll: () => http.get("/api/channels"),
  create: (data) => http.post("/api/channels", data),
  update: (id, data) => http.put(`/api/channels/${id}`, data),
  delete: (id) => http.delete(`/api/channels/${id}`),
};
