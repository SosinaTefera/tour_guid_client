import React, {useState} from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Divider,
} from '@mui/material';
import {Fab} from '@mui/material';
import {Add} from '@mui/icons-material';
import api from '../services/api';
import toast, {Toaster} from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";

const GalleryModal = ({mutate}) => {
  const [open, setOpen] = useState (false);
  const [loading, setLoading] = useState (false);
  const [image, setImage] = useState (null);
  const [description, setDescription] = useState ('');
  const [error, setError] = useState ('');
  const [imagePreview, setImagePreview] = useState (null);
  const {user}=useAuth()
  const handleOpen = () => setOpen (true);
  const handleClose = () => setOpen (false);

  const handleDescriptionChange = e => {
    setDescription (e.target.value);
  };

  const onSubmit = async e => {
    e.preventDefault ();

    // Validation
    if (!image) {
      setError ('Image is required');
      return;
    }

    if (!description) {
      setError ('Description is required');
      return;
    }

    setLoading (true);
    setError ('');

    try {
      // Prepare FormData
      const formData = new FormData ();
      formData.append ('image', image);
      formData.append ('description', description);

      const token = localStorage.getItem ('token');

      await api.post ('/galleries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success ('Picture uploaded successfully', {
        position: 'top-right',
      });
      handleClose ();
      setLoading (false);
      mutate ();
      setImage (null);
      setDescription ('');
    } catch (error) {
      console.error ('Error uploading image:', error);
      setLoading (false);
      toast.error(error,{position:'top-right'})
    }
  };
  const handleImageChange = e => {
    const file = e.target.files[0];
    setImage (file);

    // Generate a preview URL for the selected image
    const previewUrl = URL.createObjectURL (file);
    setImagePreview (previewUrl);
  };
  return (
    <Box>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        style={{
          position: 'fixed',
          display:user.role === 'admin'?'flex':'none',
          bottom: '20px',
          right: '20px',
        }}
      >
        <Add />
      </Fab>
      <div><Toaster /></div>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: 24,
            width: '500px',
            borderRadius: '8px',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              mb: '70px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add Gallery Entry
            </Typography>
            <Divider />

          </Box>

          <form onSubmit={onSubmit}>
            <Box sx={{gap: '20px', display: 'flex', flexDirection: 'column'}}>

              {/* Image Upload */}
              <label
                htmlFor="file-input"
                style={{
                  display: 'block',
                  cursor: 'pointer',
                  marginBottom: '10px',
                }}
              >
                {imagePreview
                  ? // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      style={{
                        width: '100%',
                        height: '200px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                  : <div
                      style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '8px',
                      }}
                    >
                      <Typography variant="body1" color="textSecondary">
                        Click to Upload Image
                      </Typography>
                    </div>}
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{display: 'none'}}
              />

              {/* Description */}
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                tabIndex={5}
                value={description}
                onChange={handleDescriptionChange}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading
                  ? <CircularProgress size={24} color="inherit" />
                  : 'Upload'}
              </Button>
            </Box>

          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default GalleryModal;
