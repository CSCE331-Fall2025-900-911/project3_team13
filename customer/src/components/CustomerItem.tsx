import { Box, Typography, Card, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoIcon from '@mui/icons-material/Photo';
import { useParams } from 'react-router-dom';
import { foodItems } from '../mockDatabase';
import { FoodItem } from '../types';
import { useState } from 'react';
import CustomerModify from './CustomerModify';

interface CustomerItemProps {
  onBack: () => void;
  onAddToCart: (item: FoodItem) => void;
}

export default function CustomerItem({ onBack, onAddToCart }: CustomerItemProps) {
  const { seriesName } = useParams();
  const item: FoodItem | undefined = foodItems.find((i) => i.name === seriesName);

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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ mt: 2, position: 'relative', overflow: 'hidden' }}
    >
      {/* Back Arrow */}
      <IconButton
        color="primary"
        onClick={onBack}
        sx={{ alignSelf: 'flex-start', ml: 4, mb: 1 }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Main Item Layout */}
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          m: 2,
          width: '80%',
          maxWidth: 800,
        }}
      >
        {/* LEFT: Name + Icon */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="30%"
        >
          <Typography variant="h6" sx={{ color: '#000' }}>
            {item.name}
          </Typography>
          <Box
            sx={{
              width: 150,
              height: 150,
              bgcolor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
            }}
          >
            <PhotoIcon sx={{ fontSize: 60, color: '#aaa' }} />
          </Box>
        </Box>

        {/* MIDDLE: Add + Description + Modify */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="40%"
          textAlign="center"
        >
          <Button
            variant="contained"
            color="primary"
            className="series-add-button"
            sx={{ mb: 1 }}
            onClick={() => onAddToCart(item)}
          >
            Add to Order
          </Button>
          <Typography variant="body2" sx={{ mb: 1, color: '#000' }}>
            {item.description}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            className="series-modify-button"
            onClick={() => setModifyOpen(true)}
          >
            Modify
          </Button>
        </Box>

        {/* RIGHT: Price */}
        <Box width="20%" textAlign="center">
          <Typography variant="h6" sx={{ color: '#000' }}>
            ${item.price.toFixed(2)}
          </Typography>
        </Box>
      </Card>

      {/* MODIFY DIALOG */}
      <CustomerModify open={modifyOpen} onClose={() => setModifyOpen(false)} />
    </Box>
  );
}