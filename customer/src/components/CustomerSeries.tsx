import { Box, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { FoodItem } from '../types';
import { foodItems } from '../mockDatabase';
import PhotoIcon from '@mui/icons-material/Photo';
import './Customer.css';

interface CustomerSeriesProps {
  onCartOpen: () => void;
}

export default function CustomerSeries({ onCartOpen }: CustomerSeriesProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const seriesItems: FoodItem[] = foodItems.filter(item => item.series === id);

  return (
    <Box className="series-page">
      {/* Top Bar */}
      <Box className="series-top-bar">
        <IconButton onClick={() => navigate('/menu')}>
          <ArrowBackIcon />
        </IconButton>
        <h1>{id?.replace(/-/g, ' ')}</h1>
      </Box>

      {/* Items */}
      <Box className="series-items-container">
        {seriesItems.map(item => (
          <Box key={item.id} className="series-item-card">
            <PhotoIcon sx={{ fontSize: 60, color: '#aaa' }} />
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p>${item.price.toFixed(2)}</p>
            <Button
              variant="contained"
              onClick={() => navigate(`/item/${encodeURIComponent(item.name)}`)}
            >
              View / Modify
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}