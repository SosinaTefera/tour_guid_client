import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, CircularProgress } from "@mui/material";
import api from "../../services/api"; 
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const EditTour = () => {
  const location = useLocation();
  const tour = location.state?.tour;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState(tour?.title || "");
  const [description, setDescription] = useState(tour?.description || "");
  const [price, setPrice] = useState(tour?.price || "");
  const [latitude, setLatitude] = useState(tour?.latitude || "");
  const [longitude, setLongitude] = useState(tour?.longitude || "");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tour) {
      toast.error('No tour data available', { position: 'top-right' });
      navigate('/dashboard/tours_admin');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Unauthorized User', { position: 'top-right' });
      navigate('/dashboard/tours_admin');
      return;
    }
  }, [tour, user, navigate]);

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
      if (image) {
        formData.append("image", image);
      }

      const token = localStorage.getItem("token");
      const response = await api.put(`tour/${tour.id}`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      });

      toast.success('Tour updated successfully!', {
        position: "top-right" 
      });
      navigate('/dashboard/tours_admin');
    } catch (err) {
      setError("Failed to update tour");
      console.error("Error:", err);
      toast.error('Failed to update tour', {
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{
      width: "80%",
      mt: '20px'
    }}>
      <div><Toaster/></div>
      <Typography variant="h4" sx={{ mb: 3 }}>Edit Tour</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <TextField 
          label="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          fullWidth 
        />
        <TextField 
          label="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
          fullWidth 
          multiline 
          rows={3} 
        />
        <TextField 
          label="Price" 
          type="number" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          required 
          fullWidth 
        />
        <TextField 
          label="Latitude" 
          type="number" 
          value={latitude} 
          onChange={(e) => setLatitude(e.target.value)} 
          required 
          fullWidth 
        />
        <TextField 
          label="Longitude" 
          type="number" 
          value={longitude} 
          onChange={(e) => setLongitude(e.target.value)} 
          required 
          fullWidth 
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Update Tour"}
        </Button>
      </form>
    </Container>
  );
};

export default EditTour; 