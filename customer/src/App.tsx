import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box, IconButton, Slide } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CustomerLogin from "./components/CustomerLogin";
import CustomerMenu from "./components/CustomerMenu";
import CustomerSeries from "./components/CustomerSeries";
import CustomerCartSidebar from "./components/CustomerCartSidebar";

function AppContent() {
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  const showCartButton = location.pathname !== '/';

  return (
    <Box sx={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Cart Button */}
      {showCartButton && (
        <IconButton
          color="primary"
          onClick={() => setCartOpen(true)}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 2000,
            backgroundColor: 'white',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            '&:hover': { backgroundColor: '#f0f0f0' },
          }}
        >
          <ShoppingCartIcon />
        </IconButton>
      )}

      {/* Page Content */}
      <Routes>
        {/* LOGIN PAGE */}
        <Route
          path="/"
          element={
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
              }}
            >
              <CustomerLogin />
            </Box>
          }
        />

        {/* MENU PAGE */}
        <Route
          path="/menu"
          element={
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: { xs: 2, sm: 4 },
                overflowY: 'auto',
              }}
            >
              <CustomerMenu />
            </Box>
          }
        />

        {/* SERIES PAGE */}
        <Route
          path="/series/:id"
          element={
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: { xs: 2, sm: 4 },
                overflowY: 'auto',
              }}
            >
              <CustomerSeries />
            </Box>
          }
        />
      </Routes>

      {/* Cart Sidebar */}
      <Slide direction="left" in={cartOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            width: { xs: '85%', sm: 400 },
            bgcolor: 'white',
            boxShadow: '-4px 0 12px rgba(0,0,0,0.4)',
            zIndex: 3000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <CustomerCartSidebar onClose={() => setCartOpen(false)} />
        </Box>
      </Slide>
    </Box>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
