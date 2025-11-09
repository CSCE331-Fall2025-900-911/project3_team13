import { Box, Typography, Button } from '@mui/material';
import { FoodItem } from '../types';
import './Customer.css';

interface CustomerCheckoutProps {
  cartItems: FoodItem[];
}

export default function CustomerCheckout({ cartItems }: CustomerCheckoutProps) {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Box sx={{ width: '100%', maxWidth: 500, p: 4 }}>
      <Typography variant="h4" mb={2}>Checkout</Typography>
      {cartItems.length === 0 ? (
        <Typography>No items in your cart.</Typography>
      ) : (
        <>
          {cartItems.map((item, idx) => (
            <Box key={idx} display="flex" justifyContent="space-between">
              <Typography>{item.name}</Typography>
              <Typography>${item.price.toFixed(2)}</Typography>
            </Box>
          ))}
          <Box display="flex" justifyContent="space-between" mt={2} fontWeight="bold">
            <Typography>Total</Typography>
            <Typography>${total.toFixed(2)}</Typography>
          </Box>
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>Place Order</Button>
        </>
      )}
    </Box>
  );
}
