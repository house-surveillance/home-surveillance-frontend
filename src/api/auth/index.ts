import axiosConfig from "../axios";

const AUTH_URL = "/auth";
export const login = async (userName: string, password: string) => {
  try {
    const response = await axiosConfig.post(AUTH_URL + "/login", {
      userName,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (
  userName: string,
  email: string,
  password: string,
  roles: Array<"ADMIN" | "RESIDENT" | "SUPERVISOR">,
  fullName: string,
  imageProfile: File,
  residenceName: string,
  residenceAddress: string,
  isAuth: boolean = true,
  creatorId: number = 0
) => {
  try {
    console.log(creatorId);

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("roles", roles.join(","));
    formData.append("fullName", fullName);
    formData.append("file", imageProfile);
    formData.append("residenceName", residenceName);
    formData.append("residenceAddress", residenceAddress);
    formData.append("creatorId", creatorId.toString());

    const response = await axiosConfig.post(AUTH_URL + "/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (isAuth) {
      sessionStorage.setItem("user", JSON.stringify(response.data));
    }
    //return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (
  id: string,
  userName: string,
  email: string,
  roles: Array<"ADMIN" | "RESIDENT">,
  fullName: string,
  imageProfile: File
) => {
  try {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("roles", roles.join(","));
    formData.append("fullName", fullName);
    formData.append("file", imageProfile);

    const response = await axiosConfig.put(AUTH_URL + `/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  sessionStorage.removeItem("user");
};
