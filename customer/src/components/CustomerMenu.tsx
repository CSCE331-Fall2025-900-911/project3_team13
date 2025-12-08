import { useState, useEffect } from 'react';
import { Box, Button, TextField, Paper, List, ListItem, ListItemText, CircularProgress, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { translateText } from '../services/translationService';
import './Customer.css';
import milk from '../assets/milk.svg'
import fruit from '../assets/fruit.svg'
import special from '../assets/special.svg'
import seasonal from '../assets/calendar.svg'

interface MenuItem {
  id: number;
  name: string;
  translatedName?: string;
  category: string;
  price?: number;
}

interface MenuItemResponse {
    id: number,
    name: string,
    category: string,
    price: number,
    modifications: string
}

type Props = {
  onCartOpen: () => void;
};

export default function CustomerMenu({ onCartOpen }: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const seriesList = [
    { id: 'Milk Tea', name: 'Milk Tea', icon: milk },
    { id: 'Fruit Tea', name: 'Fruit Tea', icon: fruit },
    { id: 'Specialty Drink', name: 'Specialty Drink', icon: special },
    { id: 'Seasonal Item', name: 'Seasonal Item', icon: seasonal }
  ];

  const categories = seriesList.map(s => s.name);

  // Fetch all items
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const results = await axios.get<{ items: MenuItemResponse[] }>(
          "http://localhost:3000/api/get-all-items"
        );

        const allItems: MenuItem[] = results.data.items.map((item: MenuItemResponse) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price
        }));

        // Translate item names if not English
        if (i18n.language !== 'en') {
          for (let item of allItems) {
            item.translatedName = await translateText(item.name, i18n.language);
          }
        }

        setItems(allItems);
        setFilteredItems(allItems);
      } catch (err) {
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, [i18n.language]);

  // Filter items based on search
  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredItems(items.filter(item => item.name.toLowerCase().includes(lower)));
  }, [search, items]);

  return (
    <Box className="menu-page" position="relative">
      <Box className="menu-top-bar">
        <TextField
          placeholder={t('menu.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          className="menu-search"
          fullWidth
        />
        {/* Show search results dropdown */}
        {search && (
          <Paper
            sx={{
              position: 'absolute',
              top: 50,
              left: 0,
              right: 0,
              maxHeight: 300,
              overflowY: 'auto',
              zIndex: 10
            }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={20} />
              </Box>
            ) : filteredItems.length === 0 ? (
              <ListItem>
                <ListItemText primary={t('menu.noItemsFound')} />
              </ListItem>
            ) : (
              <List>
                {filteredItems.map(item => (
                  <ListItem
                    key={item.id}
                    component="button"
                    onClick={() =>
                      navigate(`/series/${encodeURIComponent(item.category)}/item/${encodeURIComponent(item.name)}`)
                    }
                  >
                    <ListItemText
                      primary={`${item.translatedName || item.name} - $${item.price ? Number(item.price).toFixed(2) : 'N/A'}`}
                      secondary={item.category}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        )}
      </Box>

      {/* Series buttons below search */}
      <Box className="menu-series-container" sx={{ mt: 8 }}>
        {seriesList.map(series => (
          <Button
            key={series.id}
            variant="contained"
            className="menu-series-button"
            onClick={() => navigate(`/series/${encodeURIComponent(series.id)}`)}
          >
            <Stack direction="column" alignItems="center" spacing={3}>
                <img src={series.icon} alt={series.name} style={{ width: '120px', height: '120px' }} />
                <h2>{t(`menu.series.${series.id.replace(/\s+/g, '')}`)}</h2>
            </Stack>
            
          </Button>
        ))}
      </Box>
    </Box>
  );
}