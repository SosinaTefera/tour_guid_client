import React, { useEffect, useState, useContext } from "react";
import {
    Container,
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Box,
    IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import api from "../../services/api";
import DeleteIcon from "@mui/icons-material/Delete";
import AuthContext from "../../context/AuthContext";

const Tours = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState({});
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);


    const handleDeleteTour = async (tourId) => {
        try {
            setDeleting((prev) => ({ ...prev, [tourId]: true }));
            await api.delete(`/tours/${tourId}`);
            setTours(tours.filter((tour) => tour.id !== tourId));
        } catch (error) {
            console.error("Failed to delete tour", error);
        } finally {
            setDeleting((prev) => ({ ...prev, [tourId]: false }));
        }
    };

    const handleCardClick = (tour) => {
        navigate(`/tours/${tour.id}`, { state: { tour } }); 
    };

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await api.get("/tour");
                setTours(response.data);
            } catch (error) {
                console.error("Failed to fetch tours:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    if (loading)
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    width: "100%",
                }}
            >
                <CircularProgress />
            </Box>
        );

    return (
        <Container>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Available Tours
            </Typography>
            <Grid container spacing={3}>
                {tours.map((tour) => (
                    <Grid item xs={12} sm={6} md={4} key={tour.id}>
                        <Card
                            sx={{ position: "relative", cursor: "pointer" }} 
                            onClick={() => handleCardClick(tour)} 
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOaPnazUg5jb4P6OXyoOLIpUB7BRCx9iRWFg&s"}
                                alt={tour.title}
                            />
                            <CardContent>
                                <Typography variant="h6"
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >{tour.title}</Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {tour.description}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                    💰 ${tour.price}
                                </Typography>
                                {localStorage.getItem("role") === "admin"?(  <IconButton
                                    sx={{
                                        position: "absolute",
                                        bottom: 8,
                                        right: 8,
                                        color: "red",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        handleDeleteTour(tour.id);
                                    }}
                                    disabled={deleting[tour.id]}
                                >
                                    {deleting[tour.id] ? (
                                        <CircularProgress size={24} sx={{ color: "red" }} />
                                    ) : (
                                        <DeleteIcon />
                                    )}
                                </IconButton>): null
                                }
                              
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Tours;