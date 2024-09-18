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
  roles: Array<"ADMIN" | "RESIDENT">,
  fullName: string,
  imageProfile: File,
  isAuth: boolean = true
) => {
  try {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("roles", roles.join(","));
    formData.append("fullName", fullName);
    formData.append("file", imageProfile);

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

export const logout = () => {
  sessionStorage.removeItem("user");
};
