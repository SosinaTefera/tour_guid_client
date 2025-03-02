import React, { useState, useContext } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";

const RegisterPage = () => {

    const { register } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "tourist",
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            toast.success('Registration successfully completed')
        } catch (err) {
            console.error("Registration failed", err);
            toast.success("Registration failed")

            setError(err.response?.data?.message || "Registration failed.");
        }
    };

    return (
       <Box sx={{display:'flex',alignItems:'center',height:'100vh',width:'100%'}}>
   
           <Box sx={{flex:1,widht:'100%',height:'100%'}}>
                  <img
                   src="https://images.unsplash.com/photo-1568797953832-2cc7f5f7eb3c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                   
                   alt="tour" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                </Box>
            <Box sx={{flex:1,padding:'20px',alignItems:'center',justifyContent:'center',display:'flex'}} >
             <Box sx={{width:'60%',display:'flex',flexDirection:'column',gap:'20px',padding:'20px',borderRadius:'5px'}}>
                
                <Typography variant="h4" gutterBottom>Register</Typography>

                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="First Name" name="first_name" margin="normal" onChange={handleChange} required />
                    <TextField fullWidth label="Last Name" name="last_name" margin="normal" onChange={handleChange} required />
                    <TextField fullWidth label="Email" name="email" type="email" margin="normal" onChange={handleChange} required />
                    <TextField fullWidth label="Password" name="password" type="password" margin="normal" onChange={handleChange} required />
                    {/* <TextField select fullWidth label="Role" name="role" margin="normal" value={formData.role} onChange={handleChange}>
                        <MenuItem value="tourist">Tourist</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField> */}

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Register
                    </Button>
                </form>

                <NavLink
            to="/login"
            style={{ textDecoration: "none", color: "blue",ml:'60px' }}
          >
            Already have an account?
          </NavLink>
            </Box>
            </Box>
        </Box>
    );
};

export default RegisterPage;
