import { useState } from 'react'
import './App.css'
import {
  // Button,
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
      <div className="tabPanel">
        {/* Main content goes here */}
        <Tabs value={tabValue} onChange={(__, newValue) => setTabValue(newValue)}>
          <Tab label="Main Menu" value="menu" />
          <Tab label="Library" value="library" />
          <Tab label="Orders" value="orders" />
        </Tabs>

        {tabValue === 'menu' && <div>Main Menu Content</div>}
        {tabValue === 'library' && <div>Library Content</div>}
        {tabValue === 'orders' && <div>Orders Content</div>}
      </div>

    </>
  )
}

export default App
