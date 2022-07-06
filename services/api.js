import axios from "axios";
import TokenService from "./token.service";
import { toast } from "react-toastify";

let api_url = "http://localhost:8000/";
if (process.env.NODE_ENV == "production") api_url = "https://api.teskoran.id/";

const instance = axios.create({
  baseURL: api_url,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = "JWT " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "auth/jwt/create/" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const refresh = TokenService.getLocalRefreshToken();
          const rs = await instance.post(
            "auth/jwt/refresh/",
            {
              refresh,
            },
            originalConfig
          );
          TokenService.setUser(rs.data);
          return instance(originalConfig);
        } catch (_error) {
          toast.error("Token expired", { theme: "colored" });
          TokenService.removeUser();
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
