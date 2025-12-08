import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Dialog,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FoodItem } from "../types";
import { useTranslation } from "react-i18next";

interface CheckoutProps {
  cartItems: FoodItem[];
  clearCart: () => void;
}

export default function CustomerCheckout({ cartItems, clearCart }: CheckoutProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const customerId = Number(localStorage.getItem("customerId"));
  const isGuest = customerId === 1;
  console.log("🔵 localStorage.customerId =", localStorage.getItem("customerId"));

  const [items, setItems] = useState(
    cartItems.map((item, index) => ({
      ...item,
      comboId: item.comboId

    }))
  );

  const [freeDrinks, setFreeDrinks] = useState(0);
  const [selectedRedemptions, setSelectedRedemptions] = useState<number[]>([]);
  const [doneOpen, setDoneOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // Fetch loyalty info (skip guest)
  // ============================================================
  useEffect(() => {
    const fetchLoyalty = async () => {
      if (isGuest) {
        setFreeDrinks(0);
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/api/customer-loyalty", {
          params: { customerId }
        });
        console.log("📥 Loyalty response:", res.data);
console.log("🟢 Setting freeDrinks =", res.data.free_drinks);
        setFreeDrinks(res.data.free_drinks || 0);
      } catch (err) {
        console.error("Failed to fetch loyalty info:", err);
      }
    };

    fetchLoyalty();
  }, [customerId, isGuest]);

  // ============================================================
  // Remove item from cart
  // ============================================================
  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    setSelectedRedemptions(prev => prev.filter(i => i !== index));
  };

  // ============================================================
  // Totals
  // ============================================================
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  const discount = selectedRedemptions.reduce(
    (sum, index) => sum + (items[index]?.price ?? 0),
    0
  );

  const total = Math.max(subtotal - discount, 0);

  // ============================================================
  // Toggle free drink selection
  // ============================================================
  const toggleRedeem = (index: number) => {
    if (isGuest) return; // safeguard

    setSelectedRedemptions(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      if (prev.length >= freeDrinks) {
        return prev; // cannot exceed freeDrink count
      }
      return [...prev, index];
    });
  };

  // ============================================================
  // Submit order to backend
  // ============================================================
  const handleSend = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const orderIdStr = localStorage.getItem("orderId");
      if (!orderIdStr) {
        console.error("No valid order ID");
        return;
      }

      const orderId = Number(orderIdStr);

      // Guest sends no free redemption
      const freeComboIds = isGuest
        ? []
        : selectedRedemptions
            .map(i => items[i].comboId)
            .filter((id): id is number => typeof id === "number");

      const res = await axios.patch("http://localhost:3000/api/checkout", {
        orderId,
        total,
        status: "ready to pay",
        freeComboIds
      });

      console.log("Order submitted:", res.data);

      clearCart();
      setItems([]);
      setSelectedRedemptions([]);
      setFreeDrinks(0);

      setDoneOpen(true);
    } catch (err) {
      console.error("Checkout failed:", err);
      alert(t("cart.sendError"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDoneOpen(false);
    navigate("/");
  };

  // ============================================================
  // Render UI
  // ============================================================
  return (
    <Box sx={{ p: 4, color: "#000", width: "100%" }}>
      {/* TITLE */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        Total: ${total.toFixed(2)}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* ============================================================
          FREE DRINK UI (hidden for guest)
         ============================================================ */}
      {!isGuest && freeDrinks > 0 && (
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            backgroundColor: "#fff8e1",
            border: "1px solid #f0c14b",
            width: "60%",
            mx: "auto"
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            🎉 You have {freeDrinks} free drink{freeDrinks > 1 ? "s" : ""}!
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Select drinks to redeem:
          </Typography>

          {items.map((item, index) => (
            <FormControlLabel
              key={index}
              sx={{ display: "block" }}
              control={
                <Checkbox
                  checked={selectedRedemptions.includes(index)}
                  onChange={() => toggleRedeem(index)}
                  disabled={
                    !selectedRedemptions.includes(index) &&
                    selectedRedemptions.length >= freeDrinks
                  }
                />
              }
              label={`${item.name} — $${item.price.toFixed(2)}`}
            />
          ))}

          {selectedRedemptions.length > 0 && (
            <Typography sx={{ mt: 2, fontWeight: "bold" }}>
              Discount: -${discount.toFixed(2)}
            </Typography>
          )}
        </Box>
      )}

      {/* ============================================================
          CART ITEMS
         ============================================================ */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {items.map((item, index) => (
          <Box
            key={item.comboId ?? index}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="60%"
            sx={{
              p: 1,
              border: "1px solid #ccc",
              borderRadius: 1,
              backgroundColor: "#fafafa"
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{item.name}</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography>${item.price.toFixed(2)}</Typography>
              <IconButton color="error" onClick={() => removeItem(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* SEND ORDER BUTTON */}
      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          disabled={items.length === 0 || loading}
        >
          {loading ? "Processing..." : "Send to Cashier"}
        </Button>
      </Box>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={doneOpen}>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">Order sent!</Typography>
          <Button sx={{ mt: 2 }} onClick={handleClose}>
            OK
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
