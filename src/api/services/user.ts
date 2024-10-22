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

export const updateUser = async (
  id: string,
  userName: string,
  email: string,
  roles: Array<"ADMIN" | "RESIDENT" | "SUPERVISOR">,
  fullName: string,
  imageProfile: File
) => {
  try {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("roles", roles.join(","));
    formData.append("fullName", fullName);
    if (imageProfile) {
      formData.append("file", imageProfile);
    }

    const response = await axiosConfig.put("/users" + `/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
