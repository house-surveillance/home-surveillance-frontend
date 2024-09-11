import axiosConfig from "../axios";

const NOTIFICATIONS_URL = "/notifications";

export const getNotifications = async () => {
  try {
    const response = await axiosConfig.get(NOTIFICATIONS_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
