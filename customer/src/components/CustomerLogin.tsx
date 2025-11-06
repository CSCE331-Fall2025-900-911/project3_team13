import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import './CustomerLogin.css'; // <-- Import external CSS

export default function CustomerLogin() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleGo = () => {
    if (name.trim() !== '') {
      localStorage.setItem('customerName', name);
      navigate('/menu');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Welcome!</h1>
        <TextField
          label="Enter your name"
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
          Go
        </Button>
      </div>
    </div>
  );
}
