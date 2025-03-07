import {Box, CircularProgress, Grid, Typography} from '@mui/material';
import React from 'react';
import useSWR from 'swr';
import Lottie from 'lottie-react';
import api from '../../services/api';
import nothing from '../../assets/nothing.json';
import GalleryModal from '../../components/Gallery';

const fetcher = url => api.get (url).then (res => res.data);

const Gallery = () => {
  const {data: images, isLoading, mutate} = useSWR ('/galleries', fetcher);

  if (isLoading)
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

  console.log ({images});

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {images.length > 0
        ? <Box
            sx={{
              width: '95%',
              height: '97%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              bgcolor:'white'
            }}
          >
            <Box sx={{p: 4}}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',
                  maxHeight: 'calc(100vh - 150px)',
                }}
              >
                <Grid container spacing={2}>
                  {images.map ((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} bgcolor={'whitesmoke'} gap={'10px'}>
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/${image.image_url}`}
                        alt={`gallery-img-${index}`}
                        style={{
                          width: '380px',
                          height: '300px',
                          borderRadius: '8px',
                          objectFit: 'cover', // Ensures consistent image display
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Box
                        sx={{
                          height: '50px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-start',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '8px',
                          marginTop: '8px',
                          padding: '8px',
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          {image.description || 'No description available'}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Box>
        : <Box
            sx={{
              width: '100%',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <Typography variant="h5" color="primary">
              No Galleries Found !!!
            </Typography>
            <Lottie animationData={nothing} loop={true} />
          </Box>}
      <GalleryModal mutate={mutate} />
    </Box>
  );
};

export default Gallery;
