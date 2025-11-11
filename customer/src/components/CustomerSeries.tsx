import { useEffect, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoIcon from '@mui/icons-material/Photo';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Customer.css';

interface CustomerSeriesProps {
  onCartOpen: () => void;
}

// Define types for the backend response
interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string | number; // PostgreSQL may return numeric as string
}

interface MenuResponse {
  category: string;
  count: number;
  drinks: MenuItem[];
}

export default function CustomerSeries({ onCartOpen }: CustomerSeriesProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get<MenuResponse>(
          'https://project3-team13-backend.onrender.com/api/get-menu-items',
          { params: { category: id } }
        );

        // Ensure TypeScript knows what type we're getting
        const drinks = res.data.drinks || [];
        setItems(drinks);

        // Debugging: check what price looks like
        console.log('Fetched drinks:', drinks);
      } catch (err) {
        console.error('Error loading menu items:', err);
      }
    };

    if (id) {
      fetchItems();
    }
  }, [id]);

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
        {items.length > 0 ? (
          items.map((item) => (
            <Box key={item.id} className="series-item-card">
              <PhotoIcon sx={{ fontSize: 60, color: '#aaa' }} />
              <h2>{item.name}</h2>
              {/* Convert price to number safely */}
              <p>${item.price != null ? Number(item.price).toFixed(2) : 'N/A'}</p>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/series/${encodeURIComponent(id!)}/item/${encodeURIComponent(item.name)}`)
                }
              >
                View / Modify
              </Button>
            </Box>
          ))
        ) : (
          <p>No items found for this category.</p>
        )}
      </Box>
    </Box>
  );
}