import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Tours from '../pages/dashboard/Tours';



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<Tours />} />
        <Route path="tours" element={<Tours />} />
     
      </Route>
    </Routes>
  );
};

export default AppRoutes;
