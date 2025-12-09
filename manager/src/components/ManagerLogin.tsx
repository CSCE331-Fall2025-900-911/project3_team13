import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import './ManagerLogin.css';

interface LoginResp {
  message: string;
  employee?: {
    id: number;
    name: string;
    username: string;
    permissions: 0 | 1;
  }
}

export default function ManagerLogin() {
  const [username, setUserame] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGo = async () => {
    if (username.trim() !== '' && password.trim() !== '') {
      try {
        await axios.post<LoginResp>('http://project3-team13-backend.onrender.com/api/login/manager', {
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
