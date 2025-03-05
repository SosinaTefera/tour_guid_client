import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Tours from '../pages/dashboard/Tours';
import TourDetails from '../pages/dashboard/ToursDetail';
import CreateTour from '../pages/dashboard/CreateTour';
import AdminAnalytics from '../pages/AdminAnalytics';
import Account from '../pages/dashboard/account';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<Tours />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:tourId" element={<TourDetails />} />
        <Route path="create-tour" element={<CreateTour />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
      <Route path="/tours" element={<Tours />} />
        <Route path="tours/:tourId" element={<TourDetails />} >
      </Route>
      <Route path="account" element={<Account />} />

    </Routes>
  );
};

export default AppRoutes;
