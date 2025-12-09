import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import './Customer.css';   // ⭐ Reuse same styling as CustomerLogin

export default function GuestName() {
  const [guestName, setGuestName] = useState('');
  const navigate = useNavigate();

  const handleContinue = async () => {
    const name = guestName.trim() || "Guest";

    try {
      // STEP 1 — create new order
      const newOrder = await axios.post<{ orderId: number }>("https://project3-team13-backend.onrender.com/api/new-order");
      const orderId = newOrder.data.orderId;
      localStorage.setItem("orderId", orderId.toString());

      // STEP 2 — link to Guest customer (ID = 1)
      await axios.post("https://project3-team13-backend.onrender.com/api/link-customer-to-order", {
        orderId,
        customerId: 1,
        employeeId: 1
      });

      // STEP 3 — update order name
      await axios.patch("https://project3-team13-backend.onrender.com/api/update-order-name", {
        orderId,
        name
      });

      // STEP 4 — store in frontend
      localStorage.setItem("customerName", name);
      localStorage.setItem("phoneNumber", "0000000000");

      // STEP 5 — navigate into menu
      navigate("/menu");

    } catch (err) {
      console.error(err);
      alert("Failed to create guest order.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1 className="login-title">Enter Your Name</h1>

        <TextField
          label="Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{
            mt: 2,
            '& input': {
              fontSize: '1.8rem',
              textAlign: 'center'
            }
          }}
        />

        <Button
          variant="contained"
          onClick={handleContinue}
          fullWidth
          size="large"
          sx={{ mt: 3 }}
        >
          Continue
        </Button>

      </div>
    </div>
  );
}
