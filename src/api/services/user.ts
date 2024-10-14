import axiosConfig from "../axios";

export const getUsers = async (userId?: string) => {
  try {
    const response = await axiosConfig.get(
      "/users" + (userId ? `/${userId}` : "")
    );
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

export const deleteUser = async (id: any) => {
  try {
    const response = await axiosConfig.delete(`/users/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
