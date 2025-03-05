import {Avatar, Box, Typography} from '@mui/material';
import React, { useState } from 'react';
import UserInfoCard from "../../components/User";
import { useAuth } from "../../context/AuthContext";

const Account = () => {
  const {user}=useAuth()
    const [avatar, setAvatar] = useState(user.avatar || 'https://via.placeholder.com/150');
  
  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          width: '95%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'whitesmoke',
          mt:'50px'
        }}
      />
      <UserInfoCard/>
      
    </Box>
  );
};

export default Account;
