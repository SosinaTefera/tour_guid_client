import React, {useEffect, useState, useContext} from 'react';
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
  Divider,
  Tooltip,
  Modal,
  Button,
} from '@mui/material';
import {useNavigate} from 'react-router-dom'; // Import useNavigate
import api from '../../services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import {useAuth} from '../../context/AuthContext';
import toast, {Toaster} from 'react-hot-toast';
import {CalendarMonth} from '@mui/icons-material';

const Tours = () => {
  const [tours, setTours] = useState ([]);
  const [loading, setLoading] = useState (true);
  const [deleting, setDeleting] = useState ({});
  const [openModal,setOpenModal]=useState(false)  
  const [selectedBooking,setSelectedBooking]=useState({})
  // const [confirm,setConfirm]=useState(false)  
  const navigate = useNavigate ();
  const {user} = useAuth ();

  const handleDeleteTour = async tourId => {
    try {
      setDeleting (prev => ({...prev, [tourId]: true}));
      console.log(`tour id is ${tourId}`)
      await api.delete (`/tour/${tourId}`);
      setTours (tours.filter (tour => tour.id !== tourId));
      toast.success ('Tour deleted successfully!');
    } catch (error) {
      console.error ('Failed to delete tour', error);
      toast.error ('Failed to delete tour', {
        position: 'top-right',
      });
    } finally {
      setDeleting (prev => ({...prev, [tourId]: false}));
    }
  };

  const handleCardClick = tour => {
    console.log('tour clieck',tour)
     navigate (`${tour.id}`, {state: {tour}}); // Pass tour data as state
  };
  useEffect (() => {
    const fetchTours = async () => {
      try {

        const response = await api.get ('/tour/');

        setTours (response.data);
      } catch (error) {
        console.error ('Failed to fetch tours:', error);
        toast.error('Failed to fetch tours',{
          position:'top-right'
        })
      } finally {
        setLoading (false);
      }
    };

    fetchTours ();
  }, []);
  

  console.log ({tours});

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
  const handleBooking = (tour) => {
    console.log('handle Booking',tour)
    setOpenModal(true)
    setSelectedBooking(tour)
  
  };

  const handleConfirm=async()=>{
     
     try {
       await api.post('/booking',{
         tour_id:selectedBooking.id,
         user_id:user.id,
         status:'pending'
       })
       toast.success('Booking Successful for this month',{position:'top-right'});
       navigate( '/dashboard/tours');
       setOpenModal(false)
       setSelectedBooking({})
     } catch (error) {
      toast.error(error.message||'Failed to book tour', {position:'top-right'})
     }
  
}
console.log({selectedBooking})

const ConfirmationModal=({selectedBooking})=>{
  return (<Modal open={openModal} onClose={()=>setOpenModal(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Confirm Booking
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Are you sure you want to confirm the booking for {selectedBooking?.title} at ${selectedBooking?.price}?
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={()=>setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={()=>handleConfirm()}>Confirm</Button>
        </Box>
      </Box>
    </Modal>
  )
}
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 'calc(100vh - 100px)',
        width: '100%',
        flexDirection: 'column',
        overflow: 'none',
        padding: '10px',
        mb: '10px',
        gap: '10px ',
      }}
    >
      <div><Toaster /></div>
      <Box sx={{width:'90%'}}>
        <Typography variant="h4" sx={{mb: 3}}>
          Recent Tours
        </Typography>
        <Divider sx={{margin:'20px'}}/>
        <Box sx={{width:'100%',height:'calc(100vh - 100px)',overflowY:'auto',display:'flex'}}>
        <Grid container spacing={3}>
          {tours.length > 0
            ? tours.map (tour => (
                <Grid item xs={12} sm={6} md={4} key={tour.id}>
                  <Card
                    sx={{
                      padding: '5px',
                      cursor: 'pointer',
                      height: '400px',
                    }}
                  >
                    {/* <CardMedia
                      component="img"
                      height="200px"
                      image={
                      // tour.image
                      //    ||
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOaPnazUg5jb4P6OXyoOLIpUB7BRCx9iRWFg&s'
                      }
                      alt={tour.title}
                      onClick={() => handleCardClick (tour)}
                    /> */}
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {tour.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {tour.description}
                      </Typography>
                      <Divider sx={{mt: '5px'}} />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          height: '50px',
                        }}
                      >

                        <Typography variant="subtitle1" sx={{mt: 1}}>
                          💰 ${tour.price}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Tooltip title="Book Online">
                            {localStorage.getItem ('role') !== 'admin' &&
                              <CalendarMonth
                                onClick={() => handleBooking (tour)}
                              />}
                          </Tooltip>

                          {localStorage.getItem ('role') === 'admin'
                            ? <IconButton
                                sx={{
                                  // position: 'a/bsolute',
                                  // bottom: 8,
                                  // right: 8,
                                  color: 'red',
                                }}
                                onClick={e => {
                                  e.stopPropagation (); // Prevent card click event
                                  handleDeleteTour (tour.id);
                                }}
                                disabled={deleting[tour.id]}
                              >
                                {deleting[tour.id]
                                  ? <CircularProgress
                                      size={24}
                                      sx={{color: 'red'}}
                                    />
                                  : <DeleteIcon />}
                              </IconButton>
                            : null}
                        </Box>
                      </Box>

                    </CardContent>
                  </Card>
                </Grid>
              ))
            : <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100px',
                  width: '100%',
                }}
              >
                <Typography color="warning">No Tour Type</Typography>
                <Box />
              </Box>}
        </Grid>
        </Box>
      </Box>
      {/* <Container>
        <Typography variant="h4" sx={{mb: 3}}>
          Frequently Tours
        </Typography>
        <Grid container spacing={3}>
          {frequentlyTours.length > 0
            ? frequentlyTours.map (tour => (
                <Grid item xs={12} sm={6} md={4} key={tour.id}>
                  <Card
                    sx={{position: 'relative', cursor: 'pointer'}} // Add cursor pointer
                    onClick={() => handleCardClick (tour)} // Pass the entire tour object
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOaPnazUg5jb4P6OXyoOLIpUB7BRCx9iRWFg&s'
                      }
                      alt={tour.title}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {tour.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {tour.description}
                      </Typography>
                      <Typography variant="subtitle1" sx={{mt: 1}}>
                        💰 ${tour.price}
                      </Typography>
                      {localStorage.getItem ('role') === 'admin'
                        ? <IconButton
                            sx={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              color: 'red',
                            }}
                            onClick={e => {
                              e.stopPropagation (); // Prevent card click event
                              handleDeleteTour (tour.id);
                            }}
                            disabled={deleting[tour.id]}
                          >
                            {deleting[tour.id]
                              ? <CircularProgress
                                  size={24}
                                  sx={{color: 'red'}}
                                />
                              : <DeleteIcon />}
                          </IconButton>
                        : null}

                    </CardContent>
                  </Card>
                </Grid>
              ))
            : <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100px',
                  width: '100%',
                }}
              >
                <Typography color="warning">No frequently Tour Type</Typography>
                <Box />
              </Box>}
        </Grid>
      </Container>
      <Container>
        <Typography variant="h4" sx={{mb: 3}}>
          Available Tours
        </Typography>
        <Grid container spacing={3}>
          {availableTours.length > 0
            ? availableTours.map (tour => (
                <Grid item xs={12} sm={6} md={4} key={tour.id}>
                  <Card
                    sx={{position: 'relative', cursor: 'pointer'}} // Add cursor pointer
                    onClick={() => handleCardClick (tour)} // Pass the entire tour object
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOaPnazUg5jb4P6OXyoOLIpUB7BRCx9iRWFg&s'
                      }
                      alt={tour.title}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {tour.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {tour.description}
                      </Typography>
                      <Typography variant="subtitle1" sx={{mt: 1}}>
                        💰 ${tour.price}
                      </Typography>
                      {localStorage.getItem ('role') === 'admin'
                        ? <IconButton
                            sx={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              color: 'red',
                            }}
                            onClick={e => {
                              e.stopPropagation (); // Prevent card click event
                              handleDeleteTour (tour.id);
                            }}
                            disabled={deleting[tour.id]}
                          >
                            {deleting[tour.id]
                              ? <CircularProgress
                                  size={24}
                                  sx={{color: 'red'}}
                                />
                              : <DeleteIcon />}
                          </IconButton>
                        : null}

                    </CardContent>
                  </Card>
                </Grid>
              ))
            : <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100px',
                  width: '100%',
                }}
              >
                <Typography color="warning">No available Tour Type</Typography>
                <Box />
              </Box>}
        </Grid>
      </Container> */}

{openModal && <ConfirmationModal selectedBooking={selectedBooking}/>}
    </Box>
  );
};



export default Tours;
