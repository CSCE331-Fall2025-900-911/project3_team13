import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import './Customer.css';
import { useTranslation } from "react-i18next";

export default function CustomerLogin() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGo = async () => {
    if (name.trim() !== '') {
      try {
        localStorage.setItem('customerName', name);
        localStorage.setItem('phoneNumber', '');

        // part 1: create new order
        const newOrder = await axios.post<{ orderId: number }>(
          "http://localhost:3000/api/new-order"
        );

        const orderId = newOrder.data.orderId;
        localStorage.setItem('orderId', newOrder.data.orderId.toString());

        // part 2: add customer
        const addCustomerRes = await axios.post<{ message: string, customerId: number }>(
          "http://localhost:3000/api/add-customer",
          {
            customerName: name,
            customerPhone: ''
          }
        );
        const customerId = addCustomerRes.data.customerId;

        // part 3: link them to order
        await axios.post("http://localhost:3000/api/link-customer-to-order", {
          orderId: orderId,
          customerId: customerId,
          employeeId: 1 // currently set to the first employee, we can find a workaround for this
        });

        console.log("Successfully created order and customer");
        console.log("Customer ID:", customerId);
        console.log("Order ID:", orderId);
        navigate('/menu');
      } catch(error) {
        console.error(error);
        alert(t('login.createError'));
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">{t('login.welcome')}</h1>
        <TextField
          label={t('login.enterName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleGo}
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          {t('login.go')}
        </Button>
      </div>
    </div>
  );
}
