import { useEffect, useState } from 'react';
import { Box, Typography, Card, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoIcon from '@mui/icons-material/Photo';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CustomerModify from './CustomerModify';
import { FoodItem } from '../types';
import './Customer.css';
import { useTranslation } from "react-i18next";
import { translateText } from '../services/translationService';

interface CustomerItemProps {
  onBack: () => void;
  onAddToCart: (item: FoodItem) => void;
  onModify?: (item: FoodItem) => void;
}

interface MenuItemResponse {
  id: number;
  name: string;
  category: string;
  price: string | number;
  description?: string;
}

export default function CustomerItem({ onBack, onAddToCart, onModify }: CustomerItemProps) {
  const { categoryName, itemName } = useParams<{ categoryName: string; itemName: string }>();
  const [item, setItem] = useState<FoodItem | null>(null);
  const [modifyOpen, setModifyOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchItem = async () => {
      if (!categoryName || !itemName) return;

      try {
        const res = await axios.get<{ drinks: MenuItemResponse[] }>(
          'https://project3-team13-backend.onrender.com/api/get-menu-items',
          { params: { category: decodeURIComponent(categoryName) } }
        );

        const drinks = res.data.drinks || [];
        const found = drinks.find(d => d.name === decodeURIComponent(itemName));
        if (found) {
          let translatedName = found.name;
          let translatedDescription = found.description || t('menu.defaultDescription');

          // Translate if not English
          if (i18n.language !== 'en') {
            translatedName = await translateText(found.name, i18n.language);
            if (found.description) {
              translatedDescription = await translateText(found.description, i18n.language);
            } else {
              translatedDescription = t('menu.defaultDescription');
            }
          }

          setItem({
            id: found.id,
            name: translatedName,
            price: Number(found.price),
            description: translatedDescription,
          });
        }
      } catch (err) {
        console.error('Error fetching item:', err);
      }
    };

    fetchItem();
  }, [categoryName, itemName, i18n.language, t]);

  const handleAddModified = (modified: FoodItem) => {
    onAddToCart(modified);
    setModifyOpen(false);
  };

  if (!item) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">{t('menu.itemNotFound')}</Typography>
        <Button onClick={onBack}>{t('menu.goBack')}</Button>
      </Box>
    );
  }

  return (
    <Box className='item-container' display="flex" flexDirection="column" alignItems="center" sx={{ mt: 2 }}>
      <IconButton color="primary" onClick={onBack} sx={{ alignSelf: 'flex-start', ml: 4, mb: 1 }}>
        <ArrowBackIcon />
      </IconButton>

      <Card className='item-card' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, m: 2, width: '80%', maxWidth: 800 }}>
        <Box display="flex" flexDirection="column" alignItems="center" width="30%">
          <Typography variant="h4" sx={{ color: '#000' }}>{item.name}</Typography>
          <Box sx={{ width: 200, height: 200, bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
            <PhotoIcon sx={{ fontSize: 60, color: '#aaa' }} />
          </Box>
        </Box>

        <Box className='item-text' display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="40%" textAlign="center">
          <Button variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => onAddToCart(item)}>{t('menu.addCart')}</Button>
          <Typography variant="h6" sx={{ mb: 1, color: '#000' }}>{item.description}</Typography>
          <Button variant="outlined" color="secondary" onClick={() => { if (onModify) onModify(item); else setModifyOpen(true); }}>
            {t('menu.viewModify')}
          </Button>
        </Box>

        <Box width="20%" textAlign="center">
          <Typography variant="h3" sx={{ color: '#000' }}>${item.price != null ? Number(item.price).toFixed(2) : 'N/A'}</Typography>
        </Box>
      </Card>

      <CustomerModify open={modifyOpen} item={item} onClose={() => setModifyOpen(false)} onAddToCart={handleAddModified} />
    </Box>
  );
}