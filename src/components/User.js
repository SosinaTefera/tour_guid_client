import React, {useState} from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  TextField,
  CircularProgress,
} from '@mui/material';
import {useAuth} from '../context/AuthContext';
import {Close, Edit, Save} from '@mui/icons-material';
import api from '../services/api';
import toast from 'react-hot-toast';

const UserInfoCard = () => {
  const {user} = useAuth ();
  const [loading, setLoading] = useState (false);
  const [avatar, setAvatar] = useState (
    user.avatar || 'https://via.placeholder.com/150'
  );
  const [description, setDescription] = useState (user.description || '');
  const [isEditing, setIsEditing] = useState (false);

  const handleImageUpload = async event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader ();
      reader.onloadend = () => {
        setAvatar (reader.result);
      };
      reader.readAsDataURL (file);
    }
    setLoading (true);
    const formData = new FormData ();
    formData.append ('profile_pic', file);
    const token = localStorage.getItem ('token');

    await api.post ('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    setLoading (false);
    toast.success ('Profile Pic updated successfully', {position: 'top-right'});
  };

  const handleDescriptionChange = async event => {
    event.preventDefault ();
    setDescription (event.target.value);
    setLoading (true);
    setLoading (false);
  };

  const toggleEdit = () => {
    setIsEditing (!isEditing);
  };

  const handleUpdateUserInfo = async () => {
    setLoading (true);
    await api.put (`/user/profile`, {
      bio:description,
    });
    setLoading (false);
    toast.success ('Your bio updated successfully !');
  };

  return (
    <Card sx={{width: 500, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 3}}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexDirection: 'column',
        }}
      >
        <Avatar
          src={loading ? '' : avatar}
          alt="User Avatar"
          sx={{width: 64, height: 64}}
        >
          {loading && (
            <CircularProgress
              size={64}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />
          )}
          </Avatar>
        <Typography variant="h6" component="h2">
          {user.first_name} {user.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Box>
      <Divider sx={{my: 2}} />
      <CardContent>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <Typography variant="subtitle1" gutterBottom>
            About
          </Typography>
          {user.detail &&
            <Box
              sx={{
                textWrap: 'wrap',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-all',
                }}
              >
                {user.detail}
              </Typography>
            </Box>}
          {isEditing
            ? <Box display={isEditing ? 'block' : 'none'}>
                <Box sx={{display: 'flex'}}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={description}
                    required
                    onChange={handleDescriptionChange}
                    variant="outlined"
                    placeholder="Write something about yourself..."
                  />
                  <Close
                    onClick={() => setIsEditing (false)}
                    sx={{color: 'red', ml: '10px', cursor: 'pointer'}}
                  />
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{mt: '10px'}}
                  onChange={handleUpdateUserInfo}
                >
                  {' '}Save
                </Button>
              </Box>
            : <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {description || 'No description available you can add here'}
                </Typography>
                <Button onClick={toggleEdit} sx={{mt: 1}}>
                  {isEditing
                    ? <Save />
                    : <Edit onClick={() => setIsEditing (true)} />}
                </Button>
              </Box>}
        </Box>
        <Grid container spacing={2} sx={{mt: 2}}>
          <Grid item xs={6} textAlign="center">
            <Typography variant="h6">{user.followers}</Typography>
            <Typography variant="body2" color="text.secondary">
              {/* Followers */}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="center">
            <Typography variant="h6">{user.following}</Typography>
            <Typography variant="body2" color="text.secondary">
              {/* Following */}
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{textAlign: 'center', mt: 2}}>
          <input
            accept="image/*"
            type="file"
            style={{display: 'none'}}
            id="image-upload"
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <Button variant="outlined" component="span">
              Change Avatar
            </Button>
          </label>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
