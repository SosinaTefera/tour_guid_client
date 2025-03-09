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
import PrivateRoute from './PrivateRoute';
import Gallery from '../pages/dashboard/Gallery';
import BookedPage from '../pages/dashboard/Booked';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
      <Route
        path="dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminAnalytics />} />
        <Route path="tours_admin" element={<Tours />} />
        <Route path="tours_admin/:tourId" element={<TourDetails />} />
        <Route path="create-tour" element={<CreateTour />} />
        <Route
          path="tours"
          element={
            <PrivateRoute>
              <Tours />
            </PrivateRoute>
          }
        >
        </Route>
          <Route path="tours/:tourId" element={<TourDetails />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="booked" element={<BookedPage />} />
          <Route path="account" element={<Account />} />

      </Route>
    </Routes>
  );
};

export default AppRoutes;
