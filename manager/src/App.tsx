import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Box, IconButton, Slide } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ManagerLogin from "./components/ManagerLogin";
import { ManagerLayout } from "./components/ManagerLayout";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
      <Routes>
        <Route path="/" element={<Box sx={styles.pageContainer}><ManagerLogin /></Box>} />
        <Route path="/layout" element={<Box sx={styles.pageContainer}>
          <ManagerLayout />
        </Box>} />

      </Routes>
  );
}

const styles = {
  pageContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    sx: { p: 0, m: 0},
    overflowY: "auto",
    position: "relative",
  }
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}