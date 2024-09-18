import axiosConfig from "../axios";

const RECOGNITION_URL = "/recognition";

export const registerFaceToModel = async (
  formData: FormData
): Promise<{ message: string }> => {
  try {
    const response = await axiosConfig.post(
      RECOGNITION_URL + "/register-face",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
