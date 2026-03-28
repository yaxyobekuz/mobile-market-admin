import http from "@/shared/api/http";

export const authAPI = {
  getMe: () => http.get("/api/auth/me"),
  login: (data) => http.post("/api/auth/login", data),
};
