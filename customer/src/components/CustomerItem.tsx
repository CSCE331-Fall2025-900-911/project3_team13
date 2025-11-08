import { Box, Typography, Card, CardMedia, Button, Drawer, Modal, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams } from 'react-router-dom';
import { FoodItem } from '../types';
import { foodItems } from '../mockDatabase';
import { useState } from 'react';
import PhotoIcon from '@mui/icons-material/Photo';
interface CustomerItemProps {
  onBack: () => void;
}

export default function CustomerItem({ onBack }: CustomerItemProps) {
  const { seriesName } = useParams(); // item name from URL
  const item: FoodItem | undefined = foodItems.find(i => i.name === seriesName);

  const [cartOpen, setCartOpen] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);

  if (!item) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Item not found</Typography>
        <Button onClick={onBack}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 2 }}>
      <IconButton color="primary" onClick={onBack} sx={{ alignSelf: 'flex-start', ml: 4, mb: 1 }}>
        <ArrowBackIcon />
      </IconButton>

      {/* Use same layout as before */}
      <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, m: 2, width: '80%', maxWidth: 800 }}>
        {/* LEFT: Name + Image */}
        <Box display="flex" flexDirection="column" alignItems="center" width="30%">
          <Typography variant="h6">{item.name}</Typography>
          <PhotoIcon sx={{ fontSize: 60, color: '#aaa' }} />
        </Box>

        {/* MIDDLE: Buttons + Description */}
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="40%" textAlign="center">
          <Button variant="contained" color="primary" sx={{ mb: 1, width: '70%' }} onClick={() => setCartOpen(true)}>Add to Order</Button>
          <Typography variant="body2" sx={{ mb: 1 }}>{item.description}</Typography>
          <Button variant="outlined" color="secondary" sx={{ width: '70%' }} onClick={() => setModifyOpen(true)}>Modify</Button>
        </Box>

        {/* RIGHT: Price */}
        <Box width="20%" textAlign="center">
          <Typography variant="h6">${item.price.toFixed(2)}</Typography>
        </Box>
      </Card>

      {/* Cart Drawer */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)} sx={{ '& .MuiDrawer-paper': { width: 300, p: 2 } }}>
        <Typography variant="h6">Your Cart</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>(Cart content will appear here)</Typography>
      </Drawer>

      {/* Modify Modal */}
      <Modal open={modifyOpen} onClose={() => setModifyOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3, width: 400, textAlign: 'center' }}>
          <Typography variant="h6">Modify Drink</Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>(Customization options will appear here)</Typography>
          <Button sx={{ mt: 2 }} onClick={() => setModifyOpen(false)}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
}