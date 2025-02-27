import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getUserProfile, registerUser } from "../services/AuthService";
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

    const login = async (credentials) => {
        try {
            const data = await loginUser(credentials);
            
            localStorage.setItem("token", data.access_token);
            
            const decodedToken = jwtDecode(data.access_token);
            const userRole = decodedToken.role;

            await fetchUser();
            localStorage.setItem("role",userRole);

            navigate(userRole === "admin" ? "/dashboard" : "/tours");
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
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

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
