import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Customer.css';

type Props = {
  onCartOpen: () => void;
};

export default function CustomerMenu({ onCartOpen }: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

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
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          className="menu-search"
        />
      </Box>

      <Box className="menu-series-container">
        {seriesList
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
      </Box>
    </Box>
  );
}