import  React,{ useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import  { useAuth } from "../../context/AuthContext";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,

} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading]=useState(false)
  const [error, setError] = useState("");
  const { user,login } = useAuth();
  const navigate=useNavigate()

  useEffect(() => {
    if (user &&  user.role==='admin') {
      console.log({ user });
      return navigate('/dashboard')
    }
    if (user && user.role==='tourist') {
      console.log({ user });
      return navigate('/dashboard/tours')
    }
  }, [user]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true)
    try {
      console.log({ email,password
      })
      await login({ email, password });
    } catch (error) {
      setLoading(false)
      console.error("Login failed", error);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };  

  return (
    <Box sx={{display:'flex',alignItems:'center',height:'100vh',width:'100%'}}>
      <Box sx={{flex:1,widht:'100%',height:'100%'}}>
        <img
         src="https://plus.unsplash.com/premium_photo-1682096348418-dbef9b1d0add?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
         
         alt="tour" style={{width:'100%',height:'100%',objectFit:'cover'}} />
      </Box>
      <Box sx={{flex:1,padding:'20px'}} >
        <Box sx={{width:'60%',margin:'auto',padding:'20px',borderRadius:'5px'}}>
    
        <Typography variant="h4" align="center">
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}{" "}
        {/* Show error message */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth
            loading={loading}
            disabled={loading}
          >
            Login
          </Button>
        </form>
        <Typography
          variant="body2"
          align="center"
          style={{ marginTop: "16px" }}
        >
          <NavLink
            to="/register"
            style={{ textDecoration: "none", color: "blue" }}
          >
            Don't have an account?
          </NavLink>
        </Typography>
  
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
