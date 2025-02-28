import React,{ createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  getUserProfile,
  registerUser
} from "../services/AuthService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      if (!user) {
        
        navigate("/login");
      }
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await getUserProfile();

      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async credentials => {
    try {
      console.log({credentials})

      const data = await loginUser(credentials);
      console.log({data})

      localStorage.setItem("token", data.access_token);

      const decodedToken = jwtDecode(data.access_token);
      const userRole = decodedToken.role;

      await fetchUser();
      localStorage.setItem("role", userRole);

      navigate(userRole === "admin" ? "/dashboard" : "/tours");
    } catch (error) {
      throw error;
    }
  };

  const register = async userData => {
    try {
      await registerUser(userData);
      navigate("/login");
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  // console.log("AuthContext.Provider",{" "}
  console.log({ user });
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
