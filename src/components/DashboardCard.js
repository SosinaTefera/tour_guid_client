import {Box, Card, CardContent, Divider, Typography} from '@mui/material';
import {Hotel, AttachMoney, ErrorOutline, GroupAdd, CalendarViewDayRounded, People} from '@mui/icons-material';
import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const DashboardCards = () => {
  // "total_bookings_count": total_bookings_count,
  // "pending_tickets_count": pending_tickets_count,
  // "total_revenue": total_revenue,
  // "total_users_count": total_tourist_users_count,
  const [totalData,setTotalData]=useState([])
  const [loading,setLoading]=useState(false)
  useEffect (() => {
    const fetchData = async () => {
      try {
        const response = await api.get ('/visualization/dashboard')
        
        setTotalData(response.data);
      } catch (err) {
         toast.error('Failed to load data',{position:'top-right'})
         setLoading(false)
      } finally {
        setLoading (false);
      }
    };

    fetchData ();
  }, []);
  console.log('Total data',totalData)


  const cards = [
    {
      title: 'Total Tourists',
      value: totalData.total_users_count || 'Loading...',
      icon: <People />,
      color: '#FFA726',
      date: 'Yearly',
    },
    {
      title: 'Revenue',
      value: totalData.total_revenue ? `$${totalData.total_revenue.toLocaleString()}` : 'Loading...',
      icon: <AttachMoney />,
      color: '#66BB6A',
      date: 'Year',
    },
    {
      title: 'Pending Tickets',
      value: totalData.pending_tickets_count || 'Loading...',
      icon: <ErrorOutline />,
      color: '#EF5350',
      date: 'Today',
    },
    {
      title: 'New Bookings',
      value: totalData.total_bookings_count || 'Loading...',
      icon: <GroupAdd />,
      color: '#29B6F6',
      date: 'Monthly',
    },
  ];

 

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          // gap: '10px',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >

        {cards.map (card => (
          <Card
            key={card.title}
            sx={{
              width: 250,
              height: '200px',
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: 3,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                backgroundColor: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                borderTopLeftRadius: 8,
                // borderTopRightRadius: 8,
                width: '70px',
                height: '50px',
                position: 'absolute',
                boxShadow: '3px 3px 21px -4px rgba(0, 0, 0, 0.75)',
                WebkitBoxShadow: '3px 3px 21px -4px rgba(0, 0, 0, 0.75)',
                MozBoxShadow: '3px 3px 21px -4px rgba(0, 0, 0, 0.75)',
                // left:'10px',
                // left:'10px'
              }}
            >
              {card.icon}
            </Box>
            <CardContent
              sx={{
                mt: '80px',
              }}
            >
              <Typography variant="p" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {card.value}
              </Typography>
            {/* </CardContent> */}
            <Divider />
            <CardContent sx={{display:'flex',justifyContent:'center',alignItems:'center',gap:'20px'}}>
             <CalendarViewDayRounded/>
              <Typography variant="p" sx={{color:'gray'}}>
                {card.date}
              </Typography>
              </CardContent>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardCards;
