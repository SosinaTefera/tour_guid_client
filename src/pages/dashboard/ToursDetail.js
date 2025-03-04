import React, { setState, useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom"; 
import { Container, Typography, Box, CardMedia, CircularProgress, TextField, Button } from "@mui/material";
import AuthContext from "../../context/AuthContext";
import api from "../../services/api";


const TourDetails = () => {
    const location = useLocation();
    const tour = location.state?.tour;
    const { user } = useContext(AuthContext);

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [rating, setRating] = useState();
    const [comment, setComment] = useState("");


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`review/${tour.id}`);
                setReviews(response.data);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setReviewsLoading(false);
            }
        }
        fetchReviews();
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!rating || !comment) {
            setError("Please provide both rating and comment.");
            return;
        }
        const newReview = {
            comment: comment,
            rating: parseFloat(rating),
            tour_id: tour.id
        }
        try {
            const response = await api.post(`review`,
                newReview
            )
            console.log(`data is ${response.data}`)
            setReviews([...reviews, response.data]);

        } catch (error) {
            console.error("Failed to submit review:", error);
            setError("Failed to submit review. Please try again later.");
        }
    }



    return (
        <Container>
            <CardMedia
                component="img"
                height="400"
                image={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOaPnazUg5jb4P6OXyoOLIpUB7BRCx9iRWFg&s"}
                alt={tour.title}
            />
            <Typography variant="h4" sx={{ mb: 3 }}>
                {tour.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                {tour.description}
            </Typography>
            <Typography variant="subtitle1">💰 ${tour.price}</Typography>
            {/* {user.role === "tourist" ? (<Typography></Typography>) : null} */}
            {(

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Reviews for {tour.title}
                    </Typography>

                    {reviewsLoading ? (
                        <CircularProgress />
                    ) : reviews.length === 0 ? (
                        <Typography>No reviews available for this tour.</Typography>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            {reviews.map((review) => (
                                <Box
                                    key={review.id}
                                    sx={{
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        padding: 2,
                                        mb: 2,
                                        backgroundColor: '#f9f9f9' 
                                    }}
                                >
                                    <Typography variant="subtitle1">
                                        ⭐ {review.rating} - {review.comment}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
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
            )}
            {console.log(`user is =========> ${localStorage.getItem("token")}`)}
            {localStorage.getItem("role") === "tourist" ? (
                <Box component="form" sx={{ mt: 4 }} onSubmit={handleSubmit}>
                    <Typography variant="h6">Add a Review</Typography>
                    {error && <Typography color="error">{error}</Typography>}

                    <TextField
                        fullWidth
                        label="Rating (1-5)"
                        type="number"
                        InputProps={{ inputProps: { min: 1, max: 5, step: 0.1 } }} value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Comment"
                        multiline
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" type="submit">
                        Submit Review
                    </Button>
                </Box>
            ) : null}
        </Container>
    );
};

export default TourDetails;