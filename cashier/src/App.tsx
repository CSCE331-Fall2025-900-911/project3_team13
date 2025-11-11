import { useState, useEffect } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import { AddCustomer } from './components/AddCustomer';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  // DialogActions,
  // TextField,
  Tabs,
  Tab,
  // Radio
  // RadioGroup,
  // FormControlLabel,
  // FormControl,
  // FormLabel
} from '@mui/material';
import { LogoutButton } from './components/LogoutButton';
import { MainMenu } from './components/MainMenu';
import { Library } from './components/Library';
import { Orders } from './components/Orders';
import { OrderSummary } from './components/OrderSummary';
// import axios from 'axios';
import { useOrder } from './OrderContext';

function App() {
  const [tabValue, setTabValue] = useState<'menu' | 'library' | 'orders'>('menu');
  const [open, setOpen] = useState(false);
  const { orderId, createOrder, cancelOrder, completeOrder } = useOrder();

  useEffect(() => {
    if(!orderId) {
      createOrder();
    }
  }, []);
  /*
  const [orderId, setOrderId] = useState<number>(0);

  async function CreateOrder() {
    try {
        const response = await axios.post('http://localhost:3000/api/new-order');
        const orderId = response.data.orderId;
        return orderId;
    } catch (error) {
        console.error("Error creating new order:", error);
        alert("Failed to create new order.");
        return null;
    }
  }

  useEffect(() => {
    async function initializeOrder() {
      const orderId = await CreateOrder();
      if (orderId) {
        setOrderId(orderId);
      }
    }
    initializeOrder();
  }, []); */

  return (
    
    <>
      <header className="top-bar" role="banner" aria-label="Top navigation">
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>12:00</h1>

        <div style={{ marginLeft: 'auto', marginRight: '48px', display: 'flex', gap: '12px' }}>
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
            <img src={reactLogo} alt="" style={{width: '24px', height: '24px'}}></img>
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
              onClick={() => {
                console.log("Order saving to be implemented");
              }}
            >
              Save Order
            </Button>
            <Button 
              variant="contained" 
              className="white-button"
              onClick={async () => {
                await cancelOrder();
                await createOrder();
              }}
            >
              Cancel Order
            </Button>
          </div>
          <div className="checkout-button-container">
            <Button variant="contained" className='success-button' size="large">Checkout</Button>
          </div>
        </div>
      </div>

    </>
  )
}

export default App
