import { useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import {
  Button,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  // TextField,
  Tabs,
  Tab,
  // Radio,
  // RadioGroup,
  // FormControlLabel,
  // FormControl,
  // FormLabel
} from '@mui/material';
import { LogoutButton } from './components/LogoutButton.tsx';
import { MainMenu } from './components/MainMenu.tsx';
import { Library } from './components/Library.tsx';
import { Orders } from './components/Orders.tsx';

function App() {
  const [tabValue, setTabValue] = useState<'menu' | 'library' | 'orders'>('menu');
  // const [open, setOpen] = useState(false);
  // const [selectedOption, setSelectedOption] = useState('option1');

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
            <MainMenu />
            </div>}
          {tabValue === 'library' && <div className="tab-content">
            <Library />
            </div>}
          {tabValue === 'orders' && <div className="tab-content">
            <Orders />
            </div>}
        </div>
        <div className="side-panel">
          <Button variant="contained" color="primary" startIcon={
            <img src={reactLogo} alt="" style={{width: '24px', height: '24px'}}></img>
            }>Add Customer</Button>
          <h3>Current Total: $0</h3>
        </div>
      </div>

    </>
  )
}

export default App
