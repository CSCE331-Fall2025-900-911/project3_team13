import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import './CashierLogin.css';

export default function CashierLogin() {
  const [username, setUserame] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGo = () => {
    if (username.trim() !== '' && password.trim() !== '') {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      navigate('/layout');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Welcome!</h1>
        <TextField
          label="Enter username"
          value={username}
          onChange={(e) => setUserame(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
