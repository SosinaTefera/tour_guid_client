import React, { useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, Typography, Button } from '@mui/material';
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const BookedPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user}=useAuth()

  const columns = [
    {
      header: 'Tour Name',
      accessorKey: 'tour_name',
    },
    {
      header: 'Location',
      accessorKey: 'tour_location',
    },
    {
      header: 'Tour Status',
      id: 'status',
      accessorFn: (originalRow ) => {
        const status = originalRow.status.toLowerCase();
        let bgColor = '';
        let color = '';

        if (status === 'confirmed') {
          bgColor = 'green';
          color = 'white';
        } else if (status === 'pending') {
          bgColor = 'orange';
          color = 'white';
        } else if (status === 'rejected') {
          bgColor = 'red';
          color = 'white';
        } else {
          bgColor = 'gray';
          color = 'white';
        }

        return (
          <Box
            sx={{
              backgroundColor: bgColor,
              color: color,
              padding: '4px 8px',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {status.toUpperCase()}
          </Box>
        );
      },
    },
    {
      header: 'Booking Date',
      accessorKey: 'booking_date',
    },
    {
      header: 'Price',
      accessorKey: 'tour_price',
    },
    // Add Actions column for Admin
    {
      header: 'Actions',
      id: 'actions',
      accessorFn: (originalRow) => {
        const status = originalRow.status.toLowerCase();
        console.log({status,originalRow})
        const isAdmin = user.role === 'admin';  // Only show actions for admin
        if (!isAdmin) return null;

        return (
          <Box sx={{display:'flex',gap:'1px',alignItems:'flex-start'}}>
            {(
              <>
                {(status ==='pending'||status==='rejected')&&<Button
                  variant="contained"
                  color="success"
                  size="small"
                  loading={loading}
                  disabled={loading}
                  onClick={() => handleApproveBooking(originalRow.id)}
                >
                  Approve
                </Button>}
               {(status==='confirmed'||status==='pending')&& <Button
                  variant="contained"
                  color="error"
                  size="small"
                  loading={loading}
                  disabled={loading}
                  onClick={() => handleRejectBooking(originalRow.id)}
                >
                  Reject
                </Button>}
              </>
              
            )}
          </Box>
        );
      },
    },
  ];


  // Fetch user booking information
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const api_req = user.role === 'admin' ? '/booking' : `/booking/${user.id}`;
        const response = await api.get(api_req);
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user.id]);

  // Handle approval of a booking
  const handleApproveBooking = async (bookingId) => {
    try {
      setLoading(true)
      const response = await api.put(`/booking/update-status/${bookingId}?status=confirmed`);
      // Update the bookings state to reflect the approval
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
        )
      );
      setLoading(false)
      toast.success('Booking Approved',{position:'top-right'})
      console.log('Booking approved', response.data);
    } catch (error) {
      setLoading(false)
      toast.error('Failed to approve booking',{
        position:'top-right'
      })
      console.error('Failed to approve booking:', error);
    }
  };

  // Handle rejection of a booking
  const handleRejectBooking = async (bookingId) => {
    try {

      setLoading(true)
      const response = await api.put(`/booking/update-status/${bookingId}?status=rejected`);
      // Update the bookings state to reflect the rejection
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'rejected' } : booking
        )
      );
      console.log('Booking rejected', response.data);
      toast.success('Booking Rejected',{
        position:'top-right'
      })
      setLoading(false)

    } catch (error) {
      setLoading(false)
      toast.error('Failed to reject booking',{
        position:'top-right'
      })
      console.error('Failed to reject booking:', error);
    }
  };

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
      <Toaster/>
      <Box
        sx={{
          width: '90%',
          height: '97%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            My Bookings
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            View all your booked tours, and more
          </Typography>
        </Box>

        <Box sx={{ width: '100%', overflowY: 'auto' }}>
            <MaterialReactTable
              columns={columns}
              data={bookings}
              initialState={{
                loading,
                showColumnFilters: true, // show column filters by default
              }}
              enableRowSelection
              enableColumnFilter
              enableSorting
              enablePagination
              muiTableContainerProps={{
                sx: {
                  maxHeight: '400px', // This makes only the table body scroll
                },
              }}
              muiTableProps={{
                sx: {
                  minWidth: 650,
                  borderRadius: '8px',
                },
              }}
            />
        </Box>
      </Box>
    </Box>
  );
};

export default BookedPage;
