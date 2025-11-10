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
import CustomerLogin from "./components/CustomerLogin";
import CustomerMenu from "./components/CustomerMenu";
import CustomerSeries from "./components/CustomerSeries";
import CustomerCartSidebar from "./components/CustomerCartSidebar";
import CustomerItem from "./components/CustomerItem";
import CustomerModify from "./components/CustomerModify";
import CustomerCheckout from "./components/CustomerCheckout";
import { FoodItem } from "./types";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<FoodItem[]>([]);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [modifyItem, setModifyItem] = useState<FoodItem | null>(null);

  // Add item to cart
  const addToCart = (item: FoodItem) => {
    setCartItems((prev) => [...prev, item]);
    setCartOpen(true);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setCartOpen(false);
  };

  // Checkout
  const onCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  const handleAddModifiedItem = (item: FoodItem) => {
    addToCart(item);
  };

  const openModifyModal = (item: FoodItem) => {
    setModifyItem(item);
    setModifyOpen(true);
  };

  const showCartButton = location.pathname !== "/";

  return (
    <Box sx={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Cart button */}
      {showCartButton && location.pathname !== "/checkout" && (
        <IconButton
          color="primary"
          onClick={() => setCartOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 2000,
            backgroundColor: "white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ShoppingCartIcon />
        </IconButton>
      )}

      <Routes>
        <Route path="/" element={<Box sx={styles.pageContainer}><CustomerLogin /></Box>} />
        <Route
          path="/menu"
          element={<Box sx={styles.pageContainer}><CustomerMenu onCartOpen={() => setCartOpen(true)} /></Box>}
        />
        <Route
          path="/series/:id"
          element={<Box sx={styles.pageContainer}><CustomerSeries onCartOpen={() => setCartOpen(true)} /></Box>}
        />
        <Route
          path="/item/:seriesName"
          element={
            <Box sx={styles.pageContainer}>
              <CustomerItem
                onBack={() => navigate(-1)}
                onAddToCart={addToCart}
                onModify={openModifyModal} // Pass modify callback
              />
            </Box>
          }
        />
        <Route
          path="/checkout"
          element={
            <Box sx={styles.pageContainer}>
              {/* Back arrow for checkout */}
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ position: "absolute", top: 16, left: 16, zIndex: 1000 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <CustomerCheckout cartItems={cartItems} clearCart={clearCart} />
            </Box>
          }
        />
      </Routes>

      {/* Modifications modal */}
      {modifyItem && (
        <CustomerModify
          open={modifyOpen}
          item={modifyItem}
          onClose={() => setModifyOpen(false)}
          onAddToCart={handleAddModifiedItem}
        />
      )}

      {/* Cart sidebar */}
      <Slide direction="left" in={cartOpen} mountOnEnter unmountOnExit>
        <Box sx={styles.cartSidebar}>
          <CustomerCartSidebar
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cartItems={cartItems}
            clearCart={clearCart}
            setCartItems={setCartItems}
            onCheckout={onCheckout}
          />
        </Box>
      </Slide>
    </Box>
  );
}

const styles = {
  pageContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    px: { xs: 2, sm: 4 },
    overflowY: "auto",
    position: "relative",
  },
  cartSidebar: {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    width: { xs: "85%", sm: 400 },
    bgcolor: "white",
    boxShadow: "-4px 0 12px rgba(0,0,0,0.4)",
    zIndex: 3000,
    display: "flex",
    flexDirection: "column",
  },
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}