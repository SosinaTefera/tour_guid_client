import React, {setState, useEffect, useContext, useState} from 'react';
import {useLocation} from 'react-router-dom'; // Import useLocation
import {
  Container,
  Typography,
  Box,
  CardMedia,
  CircularProgress,
  TextField,
  Button,
  Avatar,
} from '@mui/material';
import AuthContext, {useAuth} from '../../context/AuthContext';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import toast, { Toaster } from "react-hot-toast";

const TourDetails = () => {
  const location = useLocation ();
  const tour = location.state.tour;
  const {user} = useAuth ();

  const [reviews, setReviews] = useState ([]);
  const [reviewsLoading, setReviewsLoading] = useState (true);
  const [error, setError] = useState (false);
  const [rating, setRating] = useState ();
  const [comment, setComment] = useState ('');
  const [loading,setLoading]=useState(false)

  useEffect (() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get (`review/${tour.id}`);

        setReviews (response.data);
      } catch (error) {
        console.error ('Failed to fetch reviews:', error);
      } finally {
        setReviewsLoading (false);
      }
    };
    fetchReviews ();
  },[tour.id]);

  const handleSubmit = async e => {
    e.preventDefault ();
    setLoading(true)

    if (!rating || !comment) {
      setLoading(false)
      setError ('Please provide both rating and comment.');
      toast.error('Please provide both rating and comment.');
      return;
    }
    const newReview = {
      comment: comment,
      rating: parseFloat (rating),
      tour_id: tour.id,
    };
    try {
      const response = await api.post (`review`, newReview);
      setRating('')
      setComment('')
      console.log (`data is ${response.data}`);
      toast.success('Review submitted successfully',{
        position:'top-right'
      });
      setReviews ([...reviews, response.data]);
      setLoading(false)
    } catch (error) {
      setRating('')
      setLoading(false)
      setComment('')
      console.error ('Failed to submit review:', error);
      toast.error('Failed to submit review. Please try again later.',{position:'top-right'});
      // setError ('Failed to submit review. Please try again later.');
    }
  };


  const StarRating = (rating ) => {
    const fullStars = Math.floor(rating); 
    const hasHalfStar = rating % 1 !== 0; 
    const emptyStars = 5 - Math.ceil(rating); 
  
    const stars = [];
  
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
  
    if (hasHalfStar) {
      stars.push('✩');
    }
 
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }
  
    return (
      <div>
        <div className="star-rating">
          {stars.map((star, index) => (
            <span key={index} className="star">{star}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
<Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 'calc(100vh - 100px)',
        width: '100%',
        flexDirection: 'column',
        overflow: 'auto',
        padding: '10px',
        mb: '10px',
        gap: '10px ',
      }}
    >
      <div><Toaster/></div>
      <Container>
        <CardMedia
          component="img"
          height="300"
          image={
            tour.image
            ||
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOaPnazUg5jb4P6OXyoOLIpUB7BRCx9iRWFg&s'
          }
          alt={tour.title}
        />
        <Typography variant="h4" sx={{mb: 3}}>
          {tour.title}
        </Typography>
        <Typography variant="body1" sx={{mb: 2}}>
          {tour.description}
        </Typography>
        <Typography variant="subtitle1">💰 ${tour.price}</Typography>
        {/* {user.role === "tourist" ? (<Typography></Typography>) : null} */}
        {
          <Box sx={{mt: 4}}>
            <Typography variant="h5" sx={{mb: 2}}>
              Reviews for {tour.title}
            </Typography>

            {reviewsLoading
              ? <CircularProgress />
              : reviews.length === 0
                  ? <Typography>No reviews available for this tour.</Typography>
                  : <Box sx={{mt: 2}}>
                      {reviews.map (review => (
                        <Box
                          key={review.id}
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: 2,
                            mb: 2,
                            backgroundColor: '#f9f9f9', // Slight background for better visibility
                          }}
                        >
                          <Typography variant="subtitle1" sx={{display:'flex',justifyContent:'flex-start',gap:'10px'}}>
                        <Avatar alt="Remy Sharp" src="https://images.unsplash.com/photo-1597089542047-b9873d82d8ec?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                             {StarRating(review.rating)}  {review.comment} 
                          </Typography>
                        </Box>
                      ))}
                    </Box>}
          </Box>

          // <Box sx={{ mt: 4 }}>
          //     <Typography variant="h5" sx={{ mb: 2 }}>
          //         Reviews for {tour.title}
          //     </Typography>

          //     {reviewsLoading ? (
          //         <CircularProgress />
          //     ) : reviews.length === 0 ? (
          //         <Typography>No reviews available for this tour.</Typography>
          //     ) : (
          //         <Grid container spacing={2}>
          //             {reviews.map((review) => (
          //                 <Grid item xs={12} sm={6} md={4} key={review.id}>
          //                     <Box
          //                         sx={{
          //                             border: '1px solid #ccc',
          //                             borderRadius: '4px',
          //                             padding: 2,
          //                             mb: 2,
          //                         }}
          //                     >
          //                         <Typography variant="subtitle1">
          //                             Rating: {review.rating} ⭐️
          //                         </Typography>
          //                         <Typography variant="body2">
          //                             {review.comment}
          //                         </Typography>
          //                     </Box>
          //                 </Grid>
          //             ))}
          //         </Grid>
          //     )}
          // </Box>
        }
        {console.log (`user is =========> ${localStorage.getItem ('token')}`)}
        {localStorage.getItem ('role') === 'tourist'
          ? 
          <Box component="form" sx={{mt: 4}} onSubmit={handleSubmit}>
              <Typography variant="h6">Add a Review</Typography>
              {/* {error && <Typography color="error">{error}</Typography>} */}

              <TextField
                fullWidth
                label="Rating (1-5)"
                type="number"
                InputProps={{inputProps: {min: 1, max: 5, step: 0.1}}}
                value={rating||''}
                onChange={e => setRating (e.target.value)}
                sx={{mb: 2}}
              />
              <TextField
                fullWidth
                label="Comment"
                multiline
                rows={4}
                value={comment||''}
                onChange={e => setComment (e.target.value)}
                sx={{mb: 2}}
              />
              <Button variant="contained" type="submit" disabled={loading} sx={{mb: 2}} loading={loading}>
                Submit Review
              </Button>
            </Box>
          : null}
      </Container>
    </Box>
  );
};

export default TourDetails;
