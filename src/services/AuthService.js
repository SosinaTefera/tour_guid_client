import api from "./api";

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/user/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Login failed");
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/user/register", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Login failed");
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/user/profile");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Failed to fetch user profile");
  }
};
