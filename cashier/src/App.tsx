import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Box, IconButton, Slide } from "@mui/material";
import CashierLogin from "./components/CashierLogin";
import { CashierLayout } from "./components/CashierLayout";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
      <Routes>
        <Route path="/" element={<Box sx={styles.pageContainer}><CashierLogin /></Box>} />
        <Route path="/layout" element={<Box sx={styles.pageContainer}>
          <CashierLayout />
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