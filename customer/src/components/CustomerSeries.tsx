import { Box, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import './Customer.css';

interface CustomerSeriesProps {
  onCartOpen: () => void;
}

export default function CustomerSeries({ onCartOpen }: CustomerSeriesProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy items for layout demonstration
  const items = [
    {
      name: 'Classic Milk Tea',
      price: '$4.50',
      description: 'Rich black tea with creamy milk base.',
      image: '/images/milk-tea.jpg',
    },
    {
      name: 'Taro Smoothie',
      price: '$5.00',
      description: 'Sweet taro blended with milk and ice.',
      image: '/images/taro-smoothie.jpg',
    },
    {
      name: 'Strawberry Fruit Tea',
      price: '$4.75',
      description: 'Fresh strawberry flavor with green tea.',
      image: '/images/strawberry-tea.jpg',
    },
    {
      name: 'Wintermelon Tea',
      price: '$4.25',
      description: 'Classic wintermelon with brown sugar notes.',
      image: '/images/wintermelon.jpg',
    },
  ];

  return (
    <Box className="series-page">
      {/* Top Bar */}
      <Box className="series-top-bar">
        <IconButton onClick={() => navigate('/menu')} className="series-back-button">
          <ArrowBackIcon />
        </IconButton>
        <h1 className="series-title">
          {id?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </h1>
      </Box>

      {/* Item Grid */}
      <Box className="series-items-container">
        {items.map((item, index) => (
          <Box key={index} className="series-item-card">
            <img
              src={item.image}
              alt={item.name}
              className="series-item-image"
            />
            <h2 className="series-item-name">{item.name}</h2>
            <p className="series-item-desc">{item.description}</p>
            <p className="series-item-price">{item.price}</p>
            <Button
              variant="contained"
              className="series-add-button"
              onClick={() => navigate('/item')} // ← Navigate to CustomerItem page
            >
              View / Modify
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
