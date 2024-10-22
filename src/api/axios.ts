// axios.js
import Axios from "axios";

const axios = Axios.create({});

const serverUrl = "https://065f-38-253-146-9.ngrok-free.app/api/v1"; //"https://c6d1-179-6-4-169.ngrok-free.app/api/v1"; //192.168.18.5
export const baseURL = `${serverUrl}`;

axios.defaults.timeout = 120000; // Milliseconds

axios.interceptors.request.use(
  async function (config) {
    const userLocalStorage = sessionStorage.getItem("user");
    const user = userLocalStorage ? JSON.parse(userLocalStorage) : null;

    if (user?.token) {
      config.headers["Authorization"] = `Bearer ${user?.token}`;
      config.headers["Access-Control-Allow-Credentials"] = true;
    } else {
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    config.headers["ngrok-skip-browser-warning"] = "true";

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
    if (error?.code === "ERR_NETWORK") {
      alert("Network error. Please try again later.");
    }
    throw error;
  }
);

export default axios;
