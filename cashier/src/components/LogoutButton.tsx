import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

export function LogoutButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="contained" className='black-button' onClick={() => setOpen(true)}>
        Log out
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="dlg-title">
        <DialogTitle id="dlg-title">Hello</DialogTitle>
        <DialogContent>Dialog content here</DialogContent>
      </Dialog>
    </>
  )
}