import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import api from "../services/api"; 

const AdminAnalytics = () => {
  const [toursOverTime, setToursOverTime] = useState(null);
  const [reviewsPerTour, setReviewsPerTour] = useState(null);
  const [averageRatings, setAverageRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursResponse, reviewsResponse, ratingsResponse] = await Promise.all([
          api.get("visualization/tours-over-time"),
          api.get("visualization/reviews-per-tour"),
          api.get("visualization/average-ratings"),
        ]);

        setToursOverTime(toursResponse.data);
        setReviewsPerTour(reviewsResponse.data);
        setAverageRatings(ratingsResponse.data);
      } catch (err) {
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#7b68ee"];

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>Admin Analytics</Typography>

      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography variant="h6">Tours Created Over Time</Typography>
        <LineChart width={600} height={300} data={toursOverTime.labels.map((label, index) => ({ date: label, count: toursOverTime.data[index] }))}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </Box>

      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography variant="h6">Reviews Per Tour</Typography>
        <BarChart width={600} height={300} data={reviewsPerTour.labels.map((label, index) => ({ tour: label, reviews: reviewsPerTour.data[index] }))}>
          <XAxis dataKey="tour" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="reviews" fill="#82ca9d" />
        </BarChart>
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6">Average Ratings Per Tour</Typography>
        <PieChart width={400} height={400}>
          <Pie
            data={averageRatings.labels.map((label, index) => ({ name: label, value: averageRatings.data[index] }))}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {averageRatings.labels.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </Box>
    </Container>
  );
};

export default AdminAnalytics;
