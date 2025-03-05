import React, {useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import {NavLink, Outlet, useNavigate} from 'react-router-dom';
import {Box} from '@mui/material';
import ResponsiveAppBar from './Home';
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate ();
  const {user} = useAuth();

  useEffect (
    () => {
      if (!user) {
        console.log ({user});
        navigate ('/login');
      }
    },
    [user, navigate]
  );
  return (
     <Box sx={{ alignItems: 'center', display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Box sx={{ width: '20%', display: 'flex', overflow: 'hidden' }}>
        <Sidebar />
      </Box>
      <Box sx={{ width: '80%', height: '100vh', overflow: 'hidden' }}>
        <Box sx={{ width: '100%', height: '70px', display: 'flex' }}>
          <ResponsiveAppBar />
        </Box>
        <Box sx={{ height: 'calc(100vh - 70px)', overflow: 'hidden', display: 'flex' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
