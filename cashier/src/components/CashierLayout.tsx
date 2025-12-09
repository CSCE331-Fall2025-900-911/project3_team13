import { useState, useEffect } from 'react';
import './CashierLayout.css';
import customerIcon from '../assets/person.svg'
import { AddCustomer } from './AddCustomer';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
} from '@mui/material';
import { LogoutButton } from './LogoutButton';
import { MainMenu } from './MainMenu';
import { Library } from './Library';
import { Orders } from './Orders';
import { OrderSummary } from './OrderSummary';
import { useOrder } from '../OrderContext';

export function CashierLayout() {
  const [tabValue, setTabValue] = useState<'menu' | 'library' | 'orders'>('menu');
  const [open, setOpen] = useState(false);
  const { orderId, createOrder, cancelOrder, checkout } = useOrder();
  
  const [assistance, setAssistance] = useState<any[]>([]);

  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("https://project3-team13-backend.onrender.com/api/assistance/active");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.warn("Unexpected assistance data:", data);
          return;
        }

        setAssistance(data);
        console.log("Cashier sees active requests:", data);
        console.log("Assistance length:", data.length);
        setAssistance(data);
      } catch(err) {
        console.error("Error fetching assistance:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(!orderId) {
      createOrder();
    }
  }, []);

  return (
    
    <div className="layout-content">
      <header className="top-bar" role="banner" aria-label="Top navigation">
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>{currentTime}</h1>

          <div style={{ marginLeft: 'auto', marginRight: '48px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Assistance Alert */}
          {assistance.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                className="blink-alert"
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  await fetch("https://project3-team13-backend.onrender.com/api/assistance/clear", { method: "DELETE" });
                  setAssistance([]);
                }}
              ></div>

              <span style={{ color: "red", fontWeight: "bold", fontSize: "0.9rem" }}>
                {assistance[0].kiosk} needs assistance
              </span>
            </div>
          )}
          <LogoutButton />
        </div>
      </header>
      <div className="main-content">
        <div className="tab-panel">
          <div className="tabs">
            <Tabs value={tabValue} onChange={(__, newValue) => setTabValue(newValue)}>
              <Tab label="Main Menu" value="menu" />
              <Tab label="Library" value="library" />
              <Tab label="Orders" value="orders" />
            </Tabs>
          </div>

          {tabValue === 'menu' && <div className="tab-content">
            <MainMenu orderId={orderId} />
            </div>}
          {tabValue === 'library' && <div className="tab-content">
            <Library />
            </div>}
          {tabValue === 'orders' && <div className="tab-content">
            <Orders />
            </div>}
        </div>

        <div className="side-panel">
          <Button variant="contained" onClick={() => setOpen(true)} className='white-button' startIcon={
            <img src={customerIcon} alt="" style={{width: '24px', height: '24px'}}></img>
            }>Add Customer</Button>
          <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="dlg-title">
            <DialogTitle id="dlg-title">Add Customer</DialogTitle>
            <DialogContent>
              <AddCustomer orderID={orderId}/>
            </DialogContent>
          </Dialog>
          <div className="order-summary">
            <OrderSummary orderIdentifier={orderId}/>
          </div>

          <div className="save-cancel-button-container">
            <Button 
              variant="contained" 
              className="white-button" 
              onClick={async () => {
                alert("Order saved successfully.");
                await createOrder();
              }}
            >
              Save Order
            </Button>
            <Button 
              variant="contained" 
              className="white-button"
              onClick={async () => {
                await cancelOrder();
              }}
            >
              Cancel Order
            </Button>
          </div>
          <div className="checkout-button-container">
            <Button 
              variant="contained" 
              className='success-button' 
              size="large" 
              onClick={async () => {
                await checkout();
              }}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}
