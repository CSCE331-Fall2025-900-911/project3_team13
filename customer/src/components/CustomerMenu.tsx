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
    { name: 'Milk Tea Series', id: 'milk-tea' },
    { name: 'Fruit Teas Series', id: 'fruit-teas' },
    { name: 'Specialty Drinks', id: 'specialty' },
    { name: 'Seasonal Items', id: 'seasonal' },
  ];

  return (
    <Box className="menu-page">
      {/* Top bar (search only — cart handled globally) */}
      <Box className="menu-top-bar">
        <TextField
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          className="menu-search"
        />
      </Box>

      {/* Series Buttons */}
      <Box className="menu-series-container">
        {seriesList.map((series) => (
          <Button
            key={series.id}
            variant="contained"
            className="menu-series-button"
            onClick={() => navigate(`/series/${series.id}`)}
          >
            {series.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
