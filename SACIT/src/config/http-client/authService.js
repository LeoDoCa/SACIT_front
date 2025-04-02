import AxiosClient from "./axios-client";

export const login = async (email, password) => {
  try {
    const response = await AxiosClient.post("/login", { email, password });
    const { accessToken } = response; 
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    return response;
  } catch (error) {
    console.error("Error en la solicitud de inicio de sesión:", error); 
    throw error.response?.data?.message || "Error al iniciar sesión. Por favor, verifica tus credenciales.";
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken"); 
};