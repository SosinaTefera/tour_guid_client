import React, {useEffect, useState} from 'react';
import {Container, Typography, CircularProgress, Box} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import api from '../services/api';
import DashboardCards from '../components/DashboardCard';
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminAnalytics = () => {
  const [toursOverTime, setToursOverTime] = useState (null);
  const [reviewsPerTour, setReviewsPerTour] = useState (null);
  const [averageRatings, setAverageRatings] = useState (null);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);
  const {user,logout}=useAuth()
  const navigate=useNavigate()

  useEffect(()=>{
    if(user.role !=='admin')
      {
        toast.error('Unauthorized User',{position:'top-right'})
        logout()
        return navigate(-1)
      }
  },[user,navigate])

  useEffect (() => {
    const fetchData = async () => {
      try {
        const [
          toursResponse,
          reviewsResponse,
          ratingsResponse,
        ] = await Promise.all ([
          api.get ('visualization/tours-over-time'),
          api.get ('visualization/reviews-per-tour'),
          api.get ('visualization/average-ratings'),
        ]);

        setToursOverTime (toursResponse.data);
        setReviewsPerTour (reviewsResponse.data);
        setAverageRatings (ratingsResponse.data);
      } catch (err) {
        setError ('Failed to load analytics data.');
      } finally {
        setLoading (false);
      }
    };

    fetchData ();
  }, []);

  if (loading)
    return (
       <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
              }}
            >
              <CircularProgress />
            </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff6f61', '#7b68ee'];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div><Toaster/></div>
      <Box
        sx={{
          width: '95%',
          height: '97%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          // border: '1px solid blue',
        }}
      >

        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            width:'100%'
          }}
        >
          <DashboardCards />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width:'100%',
            // flexWrap: 'wrap',
            justifyContent: 'flex-start',
            height:'calc(100vh - 300px)',
            overflowY:'scroll',
            mt:'20px',
          }}
        >

          {/* Tours Created Over Time */}
          <Box sx={{width: '100%', display: 'flex', flexDirection: 'column',gap:'20px'}}>
            <Typography fontWeight={'normal'}>Tours Created Over Time</Typography>
            <LineChart
              width={1250}
              height={300}
              data={toursOverTime.labels.map ((label, index) => ({
                date: label,
                count: toursOverTime.data[index],
              }))}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </Box>

          <Box
            sx={{display: 'flex', gap: '20px', justifyContent: 'space-between'}}
          >

            {/* Reviews Per Tour */}
            <Box sx={{mb: 5, textAlign: 'start'}}>
              <Typography variant="h6">Reviews Per Tour</Typography>
              <BarChart
                width={600}
                height={300}
                data={reviewsPerTour.labels.map ((label, index) => ({
                  tour: label,
                  reviews: reviewsPerTour.data[index],
                }))}
              >
                <XAxis dataKey="tour" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="reviews" fill="#82ca9d" />
              </BarChart>
            </Box>

            {/* Average Ratings */}
            <Box sx={{textAlign: 'center'}}>
              <Typography variant="h6">Average Ratings Per Tour</Typography>
              <PieChart width={400} height={400}>
                <Pie
                  data={averageRatings.labels.map ((label, index) => ({
                    name: label,
                    value: averageRatings.data[index],
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {averageRatings.labels.map ((_, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </Box>
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export default AdminAnalytics;
