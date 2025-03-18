import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, CircularProgress } from "@mui/material";
import api from "../../services/api"; 
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CreateTour = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setlatitude] = useState("");
  const [longitude, setlongitude] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate=useNavigate()
  const {user}=useAuth()

  useEffect(()=>{
    if(user.role !=='admin')
      {
        toast.error('Unauthorized User',{position:'top-right'})
        return navigate(-1)
      }
  },[user,navigate])
 
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("image", image);
      const token = localStorage.getItem("token");

      const response = await api.post("tour", formData, {
        headers: { "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
         },
      });

      // alert("Tour created successfully!");
      toast.success('Tour created successfully!',{
       position:"top-right" 
      })
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setlatitude("");
      setlongitude("");
      setLoading(false);
      // navigate(-1)
    } catch (err) {
      setError("Failed to create tour");
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setlatitude("");
      setlongitude("");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{
      width: "80%",
      mt:'20px'
    }}>
      <div><Toaster/></div>
      <Typography variant="h4" sx={{ mb: 3 }}>Create a New Tour</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required fullWidth multiline rows={3} />
        <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required fullWidth />
        <TextField label="Latitude" type="number" value={latitude} onChange={(e) => setlatitude(e.target.value)} required fullWidth />
        <TextField label="Longitude" type="number" value={longitude} onChange={(e) => setlongitude(e.target.value)} required fullWidth />
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Create Tour"}
        </Button>
      </form>
    </Container>
  );
};

export default CreateTour;
