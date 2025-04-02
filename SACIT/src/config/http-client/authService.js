import AxiosClient from "./axios-client";

export const login = async (email, password) => {
  try {
    const response = await AxiosClient.post("/login", { email, password });
    const { accessToken } = response.data; 
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    return response;
  } catch (error) {
    throw error.response?.data?.message || "Error al iniciar sesión";
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken"); 
};