// axios.js
import Axios from "axios";

const axios = Axios.create({});

const serverUrl = "http://localhost:3000/api/v1";
export const baseURL = `${serverUrl}`;

axios.defaults.timeout = 120000; // Milliseconds

axios.interceptors.request.use(
  async function (config) {
    const userLocalStorage = localStorage.getItem("user");
    const user = userLocalStorage ? JSON.parse(userLocalStorage) : null;

    if (user?.token) {
      config.headers["Authorization"] = `Bearer ${user?.token}`;
      config.headers["Access-Control-Allow-Credentials"] = true;
    }
    config.headers["Content-Type"] = "application/json";
    config.baseURL = baseURL;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error?.response?.status === 403) {
      alert("You do not have permission to perform this action.");
    }
    if (error?.response?.status === 401) {
      alert("Your session has expired. Please log in again.");
      window.location.href = "/login";
    }
    throw error;
  }
);

export default axios;
