import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import './CashierLogin.css';

interface LoginResp {
  message: string;
  employee?: {
    id: number;
    name: string;
    username: string;
    permissions: 0 | 1;
  }
}
export default function CashierLogin() {
  const [username, setUserame] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGo = async () => {
    if (username.trim() !== '' && password.trim() !== '') {
      try {
        await axios.post<LoginResp>('http://localhost:3000/api/login/cashier', {
          username: username.trim(),
          password: password.trim()
        });
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        navigate('/layout');
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    }
  };

  //Google OAuth login
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
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

        {/* Divider */}
        <div style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}>
          — or —
        </div>

        {/* GOOGLE LOGIN BUTTON */}
        <Button
          variant="outlined"
          color="primary"
          onClick={handleGoogleLogin}
          fullWidth
          size="large"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
