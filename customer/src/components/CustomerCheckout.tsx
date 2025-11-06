import { Box, Typography, TextField, Button, Paper } from '@mui/material';

export default function CustomerCheckout() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f5f5f5">
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={2}>Checkout</Typography>
        <TextField fullWidth label="Name" margin="normal" />
        <TextField fullWidth label="Email" margin="normal" />
        <TextField fullWidth label="Payment Info" margin="normal" />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Place Order
        </Button>
      </Paper>
    </Box>
  );
}