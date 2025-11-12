import { useState, useEffect } from 'react';
import { Box, Button, TextField, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Customer.css';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price?: number;
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

  const seriesList = [
    { id: 'Milk Tea', name: 'Milk Tea' },
    { id: 'Fruit Tea', name: 'Fruit Tea' },
    { id: 'Specialty Drink', name: 'Specialty Drink' },
    { id: 'Seasonal Item', name: 'Seasonal Item' }
  ];

  const categories = seriesList.map(s => s.name);

  // Fetch all items
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const requests = categories.map(category =>
          axios.get('http://localhost:3000/api/get-menu-items', { params: { category } })
        );

        const results = await Promise.allSettled(requests);

        const allItems: MenuItem[] = results
          .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
          .flatMap(r => Array.isArray(r.value.data?.drinks) ? r.value.data.drinks : []);

        setItems(allItems);
        setFilteredItems(allItems);
      } catch (err) {
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  // Filter items based on search
  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredItems(items.filter(item => item.name.toLowerCase().includes(lower)));
  }, [search, items]);

  return (
    <Box className="menu-page" position="relative">
      <Box className="menu-top-bar">
        <TextField
          placeholder="Search items..."
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
                <ListItemText primary="No items found" />
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
                      primary={`${item.name} - $${item.price ? Number(item.price).toFixed(2) : 'N/A'}`}
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
            {series.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
}