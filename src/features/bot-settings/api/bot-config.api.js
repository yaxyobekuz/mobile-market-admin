import http from "@/shared/api/http";
import { createQueryKeys } from "@/shared/lib/query/query-keys";

export const botConfigKeys = createQueryKeys("botConfig");

export const botConfigAPI = {
  get: () => http.get("/api/bot-config"),
  update: (data) => http.put("/api/bot-config", data),
};
