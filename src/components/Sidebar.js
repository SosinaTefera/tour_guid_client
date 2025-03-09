import { AccountBox, AddCircle, BookmarkAdded, BrowseGallery, CalendarViewMonth, Dashboard, Payment, Tour } from "@mui/icons-material";
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Sidebar = () => {
  const location = useLocation();
  const {user}=useAuth()
  const menuItems =user.role ==='admin'? [
    { text: "Analytics", path: "/dashboard", icon: <Dashboard /> },
    { text: "Tours", path: "/dashboard/tours_admin", icon: <Tour /> },
    { text: "Create Tour", path: "/dashboard/create-tour", icon: <AddCircle /> },
    // { text: "Payment", path: "/dashboard/payment", icon: <AddCircle /> },
    { text: "Booked Tours", path: "/dashboard/booked", icon: <BookmarkAdded /> },
    { text: "Gallery", path: "/dashboard/gallery", icon: <BrowseGallery /> },

  ]:[
    { text: "Tours", path: "/dashboard/tours", icon: <Tour /> },
    { text: "Gallery", path: "/dashboard/gallery", icon: <BrowseGallery /> },
    { text: "Booked Tours", path: "/dashboard/booked", icon: <CalendarViewMonth /> },
    // { text: "Payment", path: "/dashboard/payment", icon: <Payment /> },
    { text: "Account", path: "/dashboard/account", icon: <AccountBox /> },
  ];

  const activePath = location.pathname.startsWith("/dashboard/tours_admin")
  ? "/dashboard/tours_admin"
  : location.pathname.startsWith("/dashboard/tours")
  ? "/dashboard/tours"
  : location.pathname === "/dashboard"
  ? menuItems[0].path
  : location.pathname;
  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100vh",
      width:'100%'
      
  }}
>
  <Box
    sx={{
      borderRight: "1px solid #e0e0e0",
      backgroundImage: 'url("https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      height:'100vh',
      width:'100%'
  }}
    
  >
    <Box sx={{
      width:'100%',
      mt:'30px',
      display:'flex',
      gap:'10px'
    }}>
      <Box
      sx={{
        borderRight: "1px solid #e0e0e0",
        backgroundImage: 'url("https://images.unsplash.com/photo-1682687220801-eef408f95d71?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        height:'70px',
        width:'70px',
        borderRadius:'50%',
    }}
      >

      </Box>
      <h1 style={{color:'white'}}>TOUR WITH US</h1>
    </Box>
    <Divider  sx={{width:'100%',height:'1px',bgcolor:'white'}} />
   <Box sx={{
    mt:'20px',
    display:'flex',
    flexDirection:'column',
    gap:'10px',
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
   }}>
    
   {menuItems.map((item) => (
        <ListItem
          button
          key={item?.text}
          component={Link}
          to={item.path}
          sx={{
            backgroundColor:
              activePath === item.path ? "#1976d2" : "transparent",
            color: activePath === item.path ? "#fff" : "whitesmoke",
            "&:hover": {
              backgroundColor: "#eeeeee",
              color: "#333",
            },
            width:'80%',
            borderRadius:'10px',
          }}
        >
          <ListItemIcon sx={{ color: activePath === item.path ? "#fff" : "#fff" ,
             "&:hover": {
              color: "black",
            },
          }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </Box>

  </Box>


    </Box>
  );
};

export default Sidebar;
