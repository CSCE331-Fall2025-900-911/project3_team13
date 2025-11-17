import { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Customer.css';

type Props = {
  onCartOpen: () => void;
};

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string | number; // PostgreSQL may return numeric as string
}

interface MenuItemResponse {
    id: number,
    name: string,
    category: string,
    price: number,
    modifications: string
}

export default function CustomerMenu({ onCartOpen }: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchItems, setSearchItems] = useState<MenuItem[]>([]);
  const [results, setResults] = useState<MenuItem[]>([]);

  const handleQuery = (query: string) => {
    setSearch(query);
    if(search === "") {
        setResults([]);
    } else {
        let res: MenuItem[] = [];
        for(let item of searchItems) {
            if(item.name.toLowerCase().includes(query.toLowerCase())) {
                res.push(item);
            }
        }
        setResults(res);
    }
  }

  useEffect(() => {
    // self-invoking function to get all menu items
    (async () => {
        try {
            const res = await axios.get<{items: MenuItemResponse[]}>(
              "http://localhost:3000/api/get-all-items"
            );
            
            const mappedItems: MenuItem[] = res.data.items.map((item: MenuItemResponse) => ({
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price
            }));

            setSearchItems(mappedItems);
        } catch(error) {
            console.error("Error fetching items:", error);
        }
    })()
  }, [])
  const seriesList = [
    { id: 'Milk Tea', name: 'Milk Tea Series' },
    { id: 'Fruit Tea', name: 'Fruit Tea Series' },
    { id: 'Signature', name: 'Signature Series' },
    { id: 'Seasonal', name: 'Seasonal Series' },
  ];

  return (
    <Box className="menu-page">
      <Box className="menu-top-bar">
        <TextField
          placeholder="Search items..."
          value={search}
          onChange={(e) => handleQuery(e.target.value)}
          size="small"
          className="menu-search"
        />
      </Box>

      <Box className="menu-series-container">
        {results.length === 0 && seriesList
          .filter((series) =>
            series.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((series) => (
            <Button
              key={series.id}
              variant="contained"
              className="menu-series-button"
              onClick={() =>
                navigate(`/series/${encodeURIComponent(series.id)}`)
              }
            >
              {series.name}
            </Button>
          ))}
          {results.length !== 0 && results.map((item) => (
            <Box key={item.id} className="series-item-card">
              <PhotoIcon sx={{ fontSize: 60, color: '#aaa' }} />
              <h2>{item.name}</h2>
              {/* Convert price to number safely */}
              <p>${item.price != null ? Number(item.price).toFixed(2) : 'N/A'}</p>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/series/${encodeURIComponent(item.category)}/item/${encodeURIComponent(item.name)}`)
                }
              >
                View / Modify
              </Button>
            </Box>
          ))}
      </Box>
    </Box>
  );
}