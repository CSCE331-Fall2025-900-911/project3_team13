import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import './Customer.css';
import { useTranslation } from "react-i18next";

export default function CustomerLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleGuest = () => {
    console.log("🔵 Continue as Guest pressed");

    // Force guest identity
    localStorage.setItem("customerId", "1");
    localStorage.setItem("customerName", "Guest");
    localStorage.setItem("phoneNumber", "0000000000");

    console.log("Stored Guest customerId =", localStorage.getItem("customerId"));

    navigate("/guest-name");
  };

  interface LookupRes {
    found: boolean;
    customer?: {
      id: number;
      name: string;
    };
  };

  const handleGo = async () => {
    if (phoneNumber.trim() !== '') {
      try {
        // STEP 1: Lookup by phone
        const lookupRes = await axios.get<LookupRes>("http://localhost:3000/api/customer-by-phone", {
          params: { phone: phoneNumber }
        });

        // Save phone always
        localStorage.setItem('phoneNumber', phoneNumber);

        if (lookupRes.data.found) {
          // Existing customer → skip name step
          const existing = lookupRes.data.customer;
          localStorage.setItem('customerName', (existing ? existing.name : ""));
          localStorage.setItem('customerId', (existing ? existing.id.toString() : ""));

          // Create new order
          const newOrder = await axios.post<{ orderId: number }>("http://localhost:3000/api/new-order");
          const orderId = newOrder.data.orderId;
          localStorage.setItem('orderId', orderId.toString());

          
          // Link
          await axios.post("http://localhost:3000/api/link-customer-to-order", {
            orderId: orderId,
            customerName: existing?.name,
            customerPhone: phoneNumber,
            employeeId: 1
          });

          navigate('/menu');
        } 
        else {
          // New customer → go to name entry page
          navigate('/enter-name');
        }

      } catch (error) {
        console.error(error);
        alert(t('login.createError'));
      }
    }
  };


  return (
    <>
      {/* Skip link for keyboard users */}
      <a 
        href="#main-content"
        className="skip-link"
        aria-label="Skip to main content and phone keypad"
      >
        Skip to main content
      </a>

      <main id="main-content" className="login-container">
        <div className="login-box">

          <h1 className="login-title">{t('login.welcome')}</h1>
          <Button
            variant="outlined"
            className="skip-button"
            onClick={handleGuest}
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            {t('login.continueAsGuest')}
          </Button>

          <TextField
            label={t('login.enterPhone')}
            value={phoneNumber}
            variant="outlined"
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              '& input': {
                fontSize: '1.8rem',
                textAlign: 'center',
                letterSpacing: '0.15rem'
              }
            }}
          />

        {/* Keypad wrapper */}
        <div className="keypad-wrapper">
          <div className="keypad">

            {/* NUMERIC BUTTONS */}
            {['1','2','3','4','5','6','7','8','9'].map((num) => (
              <button
                key={num}
                className="keypad-button"
                onClick={() => setPhoneNumber(prev => prev + num)}
                aria-label={`Digit ${num}`}
              >
                {num}
              </button>
            ))}

            {/* LAST ROW */}
            <button
              className="keypad-button"
              onClick={() => setPhoneNumber(prev => prev + '0')}
              aria-label="Digit 0"
            >
              0
            </button>

            <button
              className="keypad-button delete"
              onClick={() => setPhoneNumber(prev => prev.slice(0, -1))}
              aria-label="Delete digit"
            >
              ←
            </button>

          </div>
        </div>

          {/* GO BUTTON BELOW THE KEYPAD */}
          <Button
            className="go-button"
            onClick={handleGo}
          >
            {t('login.go')}
          </Button>

        </div>
      </main>
    </>
  );
}
