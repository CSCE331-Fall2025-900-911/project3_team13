import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  CircularProgress 
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import Dialogue from '@mui/material/Dialog';
import axios from 'axios';
import { ModifyItem } from './ModifyItem';
import type { OrderItem } from '../OrderContext';

interface MenuItem {
  id: number;
  name: string;
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

export function Library() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);

  const categories = ['Milk Tea', 'Specialty Drink', 'Fruit Tea', 'Seasonal Drink'];

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

        setItems(allItems);
        setFilteredItems(allItems);
      } catch (err) {
        console.error('Unexpected error fetching library items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  // Filter search
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredItems(
      items.filter(item => item.name.toLowerCase().includes(lowerSearch))
    );
  }, [search, items]);

  // Open ModifyItem dialog
  const openModifyDialog = (item: MenuItem) => {
    const orderItem: OrderItem = {
      comboId: 0,
      itemId: item.id,
      name: item.name,
      price: item.price ? Number(item.price) : 0,
      ice: '100%',
      sugar: '100%',
      size: 'Medium',
      extraShots: '0',
      notes: ''
    };
    setSelectedItem(orderItem);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      p={3}
      sx={{ 
        height: '100%', 
        overflowY: 'auto',
        backgroundColor: '#fafafa'
      }}
    >
      <Typography variant="h5" gutterBottom>
        Library
      </Typography>

      <TextField
        label="Search items by name"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      {filteredItems.length === 0 ? (
        <Typography variant="body1">No items found.</Typography>
      ) : (
        <List>
          {filteredItems.map((item) => (
            <ListItem 
              key={item.id} 
              sx={{ borderBottom: '1px solid #000000ff', cursor: 'pointer' }}
              onClick={() => openModifyDialog(item)}
            >
              <ListItemAvatar>
                <Avatar>
                  <PhotoIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${item.name} - $${Number(item.price).toFixed(2)}`}
                secondary={item.category}
                slotProps={{
                  primary: { sx: { color: '#000000' } },
                  secondary: { sx: { color: '#333333' } },
                }}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Dialogue open={openDialog} onClose={() => setOpenDialog(false)}>
        {selectedItem && <ModifyItem modifyID={selectedItem.itemId} item={selectedItem} />}
      </Dialogue>
    </Box>
  );
}