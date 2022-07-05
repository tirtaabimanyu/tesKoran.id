import api from "./api";
import TokenService from "./token.service";

const signup = (username, email, password, re_password) => {
  return api.post("auth/users/", {
    username,
    email,
    password,
    re_password,
  });
};

const login = (email, password) => {
  return api
    .post("auth/jwt/create/", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.access) {
        TokenService.setUser(response.data);
      }
      return response.data;
    });
};

const logout = () => {
  TokenService.removeUser();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getSocialAuthUrl = () => {
  let redirect_uri = "http://localhost:3000/login";
  if (process.env.NODE_ENV == "production")
    redirect_uri = "https://teskoran.id/login";
  return api.get(`auth/o/google-oauth2?redirect_uri=${redirect_uri}`, {
    withCredentials: true,
  });
};

const socialLogin = (code, state) => {
  const formData = new FormData();
  formData.set("code", code);
  formData.set("state", state);
  return api
    .post("auth/o/google-oauth2/", formData, { withCredentials: true })
    .then((response) => {
      if (response.data.access) {
        TokenService.setUser(response.data);
      }
      return response.data;
    });
};

const activation = (uid, token) => {
  return api.post("auth/users/activation/", { uid, token });
};

const resendActivation = (email) => {
  return api.post("auth/users/resend_activation/", { email });
};

const resetPassword = (email) => {
  return api.post("auth/users/reset_password/", { email });
};

const resetPasswordConfirm = (uid, token, new_password, re_new_password) => {
  return api.post("auth/users/reset_password_confirm/", {
    uid,
    token,
    new_password,
    re_new_password,
  });
};

const AuthService = {
  signup,
  login,
  logout,
  getCurrentUser,
  getSocialAuthUrl,
  socialLogin,
  activation,
  resendActivation,
  resetPassword,
  resetPasswordConfirm,
};

export default AuthService;
