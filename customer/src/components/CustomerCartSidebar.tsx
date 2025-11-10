import { Box, Typography, Button, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { FoodItem } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  cartItems: FoodItem[];
  clearCart: () => void;
  setCartItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  onCheckout: () => void;
}

export default function CustomerCartSidebar({
  onClose,
  cartItems,
  clearCart,
  setCartItems,
  onCheckout,
}: Props) {
  const removeItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Your Order
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Cart items */}
      <Box flexGrow={1} overflow="auto">
        {cartItems.length === 0 ? (
          <Typography color="text.secondary">No items added yet.</Typography>
        ) : (
          cartItems.map((item, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
              sx={{ borderBottom: "1px solid #ddd", pb: 1 }}
            >
              <Box>
                <Typography sx={{ fontWeight: "bold" }}>{item.name}</Typography>
                {item.customizations && (
                  <Box ml={2}>
                    {Object.entries(item.customizations).map(([key, val]) => (
                      <Typography key={key} variant="body2" color="text.secondary">
                        {key}: {val}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>${item.price.toFixed(2)}</Typography>
                <IconButton color="error" onClick={() => removeItem(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Footer */}
      <Typography variant="h6" textAlign="center" mb={1}>
        Total: ${total.toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mb: 1 }}
        onClick={onCheckout}
        disabled={cartItems.length === 0}
      >
        Checkout
      </Button>
      <Button
        variant="outlined"
        color="error"
        fullWidth
        onClick={clearCart}
        disabled={cartItems.length === 0}
      >
        Clear Cart
      </Button>
    </Box>
  );
}