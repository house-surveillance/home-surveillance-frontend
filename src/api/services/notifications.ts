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

export const registerNotification = async (
  type: string,
  label: string,
  image: File
) => {
  try {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("label", label);
    formData.append("file", image);

    const response = await axiosConfig.post(NOTIFICATIONS_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
