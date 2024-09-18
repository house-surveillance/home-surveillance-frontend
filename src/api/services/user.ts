import axiosConfig from "../axios";

export const getUsers = async () => {
  try {
    const response = await axiosConfig.get("/users");
    console.log("🚀 ~ getUsers ~ response:", response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFaces = async () => {
  try {
    const response = await axiosConfig.get("/recognition");
    return response.data;
  } catch (error) {
    throw error;
  }
};
