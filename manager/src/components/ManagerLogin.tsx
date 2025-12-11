import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import './ManagerLogin.css';

interface LoginResp {
  message: string;
  user?: {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
  }
}

export default function ManagerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGo = async () => {
    if (username.trim() !== '' && password.trim() !== '') {
      try {
        await axios.post<LoginResp>('https://project3-team13-backend.onrender.com/api/login/manager', {
          username: username.trim(),
          password: password.trim()
        });

        // Save to localStorage if needed
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        navigate('/layout');
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Manager Login</h1>

        <TextField
          label="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          fullWidth
        />

        <TextField
          label="Enter password"
          type="password"         // ✅ hides password
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
      </div>
    </div>
  );
}
