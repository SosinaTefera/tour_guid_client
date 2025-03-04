// src/components/Sidebar.js
import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <List>
        <ListItem button component={Link} to="/dashboard/tours">
          <ListItemText primary="Tours" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
