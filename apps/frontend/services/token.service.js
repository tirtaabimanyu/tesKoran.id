import jwt_decode from "jwt-decode";
import api from "./api";

const getLocalRefreshToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refresh;
  } catch {
    return null;
  }
};

const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.access;
};

const updateLocalAccessToken = (token) => {
  let user = JSON.parse(localStorage.getItem("user"));
  user.accessToken = token;
  localStorage.setItem("user", JSON.stringify(user));
};

const getUser = () => {
  try {
    const data = JSON.parse(localStorage.getItem("user"));
    return { user: jwt_decode(data.access) };
  } catch {
    return { user: null };
  }
};

const setUser = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
    return { user: jwt_decode(user.access) };
  } catch {
    return { user: null };
  }
};

const removeUser = () => {
  localStorage.removeItem("user");
};

const verifyTokenExpired = (token) => {
  const { exp } = jwt_decode(token);
  const now = Date.now();
  return exp * 1000 < now;
};

const refreshToken = () => {
  const refresh = getLocalRefreshToken();
  return api
    .post("auth/jwt/refresh/", {
      refresh,
    })
    .then((response) => {
      return setUser(response.data);
    })
    .catch((error) => {
      return getUser();
    });
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  getUser,
  setUser,
  removeUser,
  verifyTokenExpired,
  refreshToken,
};

export default TokenService;
