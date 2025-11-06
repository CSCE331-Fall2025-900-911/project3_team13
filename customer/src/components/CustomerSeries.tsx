import { Box, Button, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import './CustomerSeries.css';

type Props = {
  onCartOpen: () => void;
};

export default function CustomerSeries({ onCartOpen }: Props) {
  const { id } = useParams();

  // Dummy items for demo purposes
  const items = [
    { name: 'Item 1', price: '$3.50' },
    { name: 'Item 2', price: '$4.00' },
    { name: 'Item 3', price: '$4.50' },
    { name: 'Item 4', price: '$5.00' },
  ];

  const [search, setSearch] = useState('');

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className="series-page">
      {/* Top bar */}
      <Box className="series-top-bar">
        <TextField
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          className="series-search"
        />
      </Box>

      {/* Series Header */}
      <h1 className="series-title">{id?.replace(/-/g, ' ').toUpperCase()}</h1>

      {/* Items */}
      <Box className="series-items-container">
        {filteredItems.map((item, index) => (
          <Box key={index} className="series-item-card">
            <p>{item.name}</p>
            <p>{item.price}</p>
            <Button variant="contained">Add to Cart</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
