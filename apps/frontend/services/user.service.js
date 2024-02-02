import api from "./api";

const getUserProfile = () => {
  return api.get(`auth/users/profile/`);
};

const checkUsername = (username) => {
  return api.get(`auth/users/check-username/?username=${username}`);
};

const setUsername = (username) => {
  return api.post("auth/users/change-username/", {
    username,
  });
};

const UserService = {
  getUserProfile,
  checkUsername,
  setUsername,
};

export default UserService;
