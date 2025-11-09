import { Box, IconButton, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FoodItem } from '../types';

interface CustomerCartSidebarProps {
  open: boolean;
  onClose: () => void;
  cartItems: FoodItem[];
  clearCart: () => void;
  onCheckout: () => void;
}

export default function CustomerCartSidebar({
  open,
  onClose,
  cartItems,
  clearCart,
  onCheckout,
}: CustomerCartSidebarProps) {
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  if (!open) return null;

  return (
    <Box className="cart-sidebar">
      {/* Header */}
      <Box className="cart-header">
        <span>CART</span>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Item list */}
      <Box className="cart-list">
        {cartItems.length === 0 ? (
          <Typography variant="body2">Cart is empty</Typography>
        ) : (
          cartItems.map((item, idx) => (
            <Box className="cart-item" key={idx}>
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </Box>
          ))
        )}
      </Box>

      {/* Total */}
      <Box className="cart-total">
        <span>TOTAL</span>
        <span>${total.toFixed(2)}</span>
      </Box>

      {/* Buttons */}
      <Box className="cart-buttons">
        <Button
          className="cart-checkout-button"
          onClick={onCheckout}
          disabled={cartItems.length === 0}
        >
          Checkout
        </Button>
        <Button
          className="cart-cancel-button"
          onClick={clearCart} // clearCart now closes sidebar too (see App.tsx)
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}