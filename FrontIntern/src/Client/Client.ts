import axios from "axios";

export const Client = axios.create({
  baseURL: "https://localhost:7027/api",
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token?: string) {
  if (token) {
    Client.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete Client.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
}

Client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

Client.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    const url: string = err?.config?.url || "";
    const isAuth = url.startsWith("/Auth/");
    if (status === 401 && !isAuth) {
      setAuthToken(undefined);
      if (window.location.pathname !== "/login") window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

const saved = localStorage.getItem("token");
if (saved) setAuthToken(saved);
