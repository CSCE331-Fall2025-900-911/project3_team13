import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Box,
  IconButton,
  Slide,
  Fab,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

import TranslationHeader from "./components/TranslationHeader";
import CustomerLogin from "./components/CustomerLogin";
import CustomerMenu from "./components/CustomerMenu";
import CustomerSeries from "./components/CustomerSeries";
import CustomerCartSidebar from "./components/CustomerCartSidebar";
import CustomerItem from "./components/CustomerItem";
import CustomerModify from "./components/CustomerModify";
import CustomerCheckout from "./components/CustomerCheckout";
import { FoodItem } from "./types";
import { TTSProvider, useTTS } from "./useTTS";
import { useTranslation } from "react-i18next";
import CustomerName from "./components/CustomerName";
import GuestName from "./components/GuestName";
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<FoodItem[]>([]);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [modifyItem, setModifyItem] = useState<FoodItem | null>(null);
  const [assistanceSent, setAssistanceSent] = useState(false);

  // Request assistance
  const requestHelp = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/assistance/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kiosk: "Kiosk 1" }),
      });

      const data = await res.json();
      console.log("Assistance sent:", data);

      setAssistanceSent(true);
    } catch (err) {
      console.error("Failed to send assistance request", err);
    }
  };

  const { speak, enabled, toggle } = useTTS();

  // 🔊 Optional: speak on route changes
  useEffect(() => {
    const path = location.pathname;
    const parts = path.split("/");

    if (path === "/") {
      speak("Welcome. Please log in to begin.");
      return;
    }

    if (path === "/menu") {
      speak("Welcome to the menu.");
      return;
    }

    // Item page: /series/<Series>/item/<Item>
    if (path.includes("/item/")) {
      const encodedItem = parts[4];
      if (encodedItem) {
        const itemName = decodeURIComponent(encodedItem);
        speak(`Viewing ${itemName}.`);
      }
      return;
    }

    // Series page only: /series/<Series>
    if (path.startsWith("/series/") && parts.length === 3) {
      const encodedSeries = parts[2];
      if (encodedSeries) {
        const seriesName = decodeURIComponent(encodedSeries);
        speak(`You are viewing the ${seriesName} series.`);
      }
      return;
    }

    if (path === "/checkout") {
      speak("You are now at checkout. Please review your order.");
      return;
    }
  }, [location.pathname, speak]);

  // Add item to cart
  const addToCart = async (item: FoodItem) => {
    try {
      const orderIdStr = localStorage.getItem("orderId");
      if (orderIdStr === null) {
        console.error("No valid order");
        return;
      }

      await axios.post("http://localhost:3000/api/add-modified-menu-item", {
        orderId: orderIdStr ? parseInt(orderIdStr) : -1,
        menuItemId: item.id,
        sugar: item.customizations ? item.customizations.sugar : "100%",
        ice: item.customizations ? item.customizations.ice : "100%",
        size: item.customizations ? item.customizations.size : "Medium",
        shots: item.customizations ? item.customizations.shots : "0",
        notes: item.customizations ? item.customizations.notes : "",
      });

      setCartItems((prev) => [...prev, item]);
      setCartOpen(true);

      speak(`${item.name} added to cart.`);
    } catch (error) {
      console.error(error);
      alert("Failed to add item to cart.");
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setCartOpen(false);
    speak("Cart cleared.");
  };

  // Checkout
  const onCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
    speak("Proceeding to checkout.");
  };

  const handleAddModifiedItem = (item: FoodItem) => {
    addToCart(item);
  };

  const openModifyModal = (item: FoodItem) => {
    setModifyItem(item);
    setModifyOpen(true);
    speak(`Modifying ${item.name}.`);
  };

  const showCartButton = location.pathname !== "/";

  return (
    <Box sx={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Translation Header */}
      <TranslationHeader />
      
      {/* Cart button */}
      {showCartButton && location.pathname !== "/checkout" && (
        <IconButton
          color="primary"
          onClick={() => {
            setCartOpen(true);
            speak("Opening cart.");
          }}
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
          <span className="cart-text">Cart</span>
          <ShoppingCartIcon />
        </IconButton>
      )}

      {location.pathname !== "/" && location.pathname !== "/checkout" && (
      <button
        onClick={requestHelp}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 2000,
          padding: "12px 20px",
          backgroundColor: "#ff4081",
          color: "white",
          border: "none",
          borderRadius: "50px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        {t('app.requestAssistance')}
      </button>
    )}

      <Routes>
        <Route
          path="/"
          element={
            <Box sx={styles.pageContainer}>
              <CustomerLogin />
            </Box>
          }
        />

        <Route
          path="/menu"
          element={
            <Box sx={styles.pageContainer}>
              <CustomerMenu onCartOpen={() => setCartOpen(true)} />
            </Box>
          }
        />

        <Route
          path="/series/:id"
          element={
            <Box sx={styles.pageContainer}>
              <CustomerSeries onCartOpen={() => setCartOpen(true)} />
            </Box>
          }
        />

        <Route
          path="/series/:categoryName/item/:itemName"
          element={
            <Box sx={styles.pageContainer}>
              <CustomerItem
                onBack={() => {
                  speak("Going back.");
                  navigate(-1);
                }}
                onAddToCart={addToCart}
                onModify={openModifyModal}
              />
            </Box>
          }
        />
    <Route path="/enter-name" element={<CustomerName />} />
          <Route path="/guest-name" element={<GuestName />} />
        <Route
          path="/checkout"
          element={
            <Box sx={styles.pageContainer}>
              <IconButton
                onClick={() => {
                  speak("Going back.");
                  navigate(-1);
                }}
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
          onClose={() => {
            speak("Closing modifications.");
            setModifyOpen(false);
          }}
          onAddToCart={handleAddModifiedItem}
        />
      )}

      {/* Cart sidebar */}
      <Slide direction="left" in={cartOpen} mountOnEnter unmountOnExit>
        <Box sx={styles.cartSidebar}>
          <CustomerCartSidebar
            open={cartOpen}
            onClose={() => {
              speak("Closing cart.");
              setCartOpen(false);
            }}
            cartItems={cartItems}
            clearCart={clearCart}
            setCartItems={setCartItems}
            onCheckout={onCheckout}
          />
        </Box>
      </Slide>

      {/* TTS Toggle Button */}
<Tooltip
  title={enabled ? t('app.disableVoiceAssistance') : t('app.enableVoiceAssistance')}
  placement="left"
>
  <Fab
    onClick={toggle}
    color={enabled ? "primary" : "default"}
    size="medium"
    sx={{
      position: "fixed",
      bottom: 24,
      left: 24,
      zIndex: 4000,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: 120,       // optional: makes room for text
      height: 80,      // optional: keeps shape balanced
      paddingTop: 1,
      paddingBottom: 1,
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: 10,
      }}
    >
      {enabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
     <span style={{ marginTop: 4, fontSize: 12, textAlign: "center" }}>
  
  Text-To-Speech
  {/* {t('app.textToSpeech')} */}
</span>
      {/* or full text: "Text-To-Speech" */}
    </Box>
  </Fab>
</Tooltip>
    </Box>
  );
}

const styles = {
  pageContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    px: { xs: 2, sm: 4 },
    overflowY: "auto" as const,
    position: "relative" as const,
  },
  cartSidebar: {
    position: "fixed" as const,
    top: 0,
    right: 0,
    height: "100vh",
    width: { xs: "85%", sm: 400 },
    bgcolor: "white",
    boxShadow: "-4px 0 12px rgba(0,0,0,0.4)",
    zIndex: 3000,
    display: "flex",
    flexDirection: "column" as const,
  },
};

export default function App() {
  return (
    <TTSProvider>
      <Router>
        <AppContent />
      </Router>
    </TTSProvider>
  );
}
