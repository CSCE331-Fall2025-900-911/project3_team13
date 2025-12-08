import { Box, Typography, Button, IconButton, Divider, Dialog } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
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
  const [items, setItems] = useState(cartItems);
  const [doneOpen, setDoneOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleSend = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const orderIdStr = localStorage.getItem('orderId');
      if(orderIdStr === null) {
        console.error("No valid order");
        return;
      }

      const res = await axios.patch("https://project3-team13-backend.onrender.com/api/checkout", {
        orderId: orderIdStr ? parseInt(orderIdStr) : -1,
        total: total,
        status: 'ready to pay'
      });
      console.log("Order created:", res.data);

      // Clear cart and show success dialog
      clearCart();
      setItems([]);
      setDoneOpen(true);
    } catch (err) {
      console.error("Failed to create order:", err);
      alert(t('cart.sendError'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDoneOpen(false);
    navigate("/");
  };

  return (
    <Box sx={{ p: 4, color: "#000", width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        {t('cart.total')} ${total.toFixed(2)}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {items.map((item, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="60%"
            sx={{
              p: 1,
              border: "1px solid #ccc",
              borderRadius: 1,
              backgroundColor: "#fafafa",
            }}
          >
            <Box textAlign="left" sx={{ flex: 1 }}>
              <Typography variant="h6">{item.name}</Typography>
              {item.customizations && (
                <Typography variant="body2" color="text.secondary">
                  {Object.entries(item.customizations)
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(", ")}
                </Typography>
              )}
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

      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          disabled={items.length === 0 || loading}
        >
          {loading ? t('cart.sending') : t('cart.sendToCashier')}
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={doneOpen} onClose={handleClose}>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">{t('cart.orderSent')}</Typography>
          <Button sx={{ mt: 2 }} onClick={handleClose}>
            {t('cart.ok')}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}