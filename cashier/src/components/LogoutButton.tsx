import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { useNavigate } from 'react-router-dom'

export function LogoutButton() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate();
  
  const Logout = () => {
          localStorage.setItem('username', '');
          localStorage.setItem('password', '');
          navigate('/');
      };

  return (
    <>
      <Button variant="contained" className='black-button' onClick={Logout}>
        Log out
      </Button>
    </>
  )
}