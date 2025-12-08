import { useEffect, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoIcon from '@mui/icons-material/Photo';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { translateText } from '../services/translationService';
import './Customer.css';

interface CustomerSeriesProps {
  onCartOpen: () => void;
}

// Define types for the backend response
interface MenuItem {
  id: number;
  name: string;
  translatedName?: string;
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
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get<MenuResponse>(
          'https://project3-team13-backend.onrender.com/api/get-menu-items',
          { params: { category: id } }
        );

        // Ensure TypeScript knows what type we're getting
        let drinks = res.data.drinks || [];
        
        // Translate item names if not English
        if (i18n.language !== 'en') {
          drinks = await Promise.all(drinks.map(async (item) => ({
            ...item,
            translatedName: await translateText(item.name, i18n.language)
          })));
        }
        
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
  }, [id, i18n.language]);

  return (
    <Box className="series-page">
      {/* Top Bar */}
      <Box className="series-top-bar">
        <IconButton onClick={() => navigate('/menu')}>
          <ArrowBackIcon />
        </IconButton>
        <h1>{t(`menu.series.${id?.replace(/\s+/g, '')}`)}</h1>
      </Box>

      {/* Items */}
      <Box className="series-items-container">
        {items.length > 0 ? (
          items.map((item) => (
            <Box key={item.id} className="series-item-card">
              <PhotoIcon sx={{ fontSize: 60, color: '#aaa' }} />
              <h2>{item.translatedName || item.name}</h2>
              {/* Convert price to number safely */}
              <p>${item.price != null ? Number(item.price).toFixed(2) : 'N/A'}</p>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/series/${encodeURIComponent(id!)}/item/${encodeURIComponent(item.name)}`)
                }
              >
                {t('menu.viewModify')}
              </Button>
            </Box>
          ))
        ) : (
          <p>{t('menu.noItemsFound')}</p>
        )}
      </Box>
    </Box>
  );
}