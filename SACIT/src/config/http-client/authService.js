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
  localStorage.removeItem("user"); 
};

export const register = async (userData) => {
  try {
    const response = await AxiosClient.post("/register", userData);
    return response;
  } catch (error) {
    console.error("Error en la solicitud de registro:", error);
    throw error.response?.data?.message || "Error al registrar usuario. Por favor, inténtalo de nuevo más tarde.";
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem("accessToken") !== null;
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await AxiosClient.post("/recover-password-email", { email });
    return response;
  } catch (error) {
    console.error("Error al solicitar restablecimiento de contraseña:", error);
    throw error.response?.data?.message || "Error al solicitar restablecimiento de contraseña.";
  }
};

export const validateToken = async (token) => {
  try {
    const response = await AxiosClient.get(`/validate-token?token=${token}`);
    return response;
  } catch (error) {
    console.error("Error al validar el token:", error);
    throw error.response?.data?.message || "Token inválido o expirado.";
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await AxiosClient.post(`/reset-password/${token}`, { 
      password 
    });
    return response;
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    throw error.response?.data?.message || "Error al restablecer contraseña.";
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await AxiosClient.put("/profile", userData);
    
    const currentUser = getCurrentUser();
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify({
        ...currentUser,
        ...response
      }));
    }
    
    return response;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw error.response?.data?.message || "Error al actualizar perfil.";
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await AxiosClient.post("/change-password", {
      currentPassword,
      newPassword
    });
    return response;
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    throw error.response?.data?.message || "Error al cambiar contraseña.";
  }
};