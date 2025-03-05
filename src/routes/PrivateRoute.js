import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log({ user, loading });
  if (loading) {
    return <div>Loading...</div>; 
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children; // If authenticated, show the requested page.
};

export default PrivateRoute;
