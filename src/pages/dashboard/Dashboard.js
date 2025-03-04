import React from "react";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default Dashboard;
