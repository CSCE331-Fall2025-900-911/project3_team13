import { Box, Button, TextField, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import './CustomerMenu.css';

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
      {/* Top bar */}
      <Box className="menu-top-bar">
        <TextField
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          className="menu-search"
        />
        <IconButton
          color="primary"
          onClick={onCartOpen}
          className="menu-cart-button"
        >
          <ShoppingCartIcon />
        </IconButton>
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
