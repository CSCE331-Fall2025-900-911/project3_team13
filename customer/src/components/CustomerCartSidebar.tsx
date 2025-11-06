import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function CustomerCartSidebar({ onClose }: { onClose: () => void }) {
  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <h2>Your Cart</h2>
      {/* Placeholder for items */}
      <Box>Cart is empty for now</Box>
    </Box>
  );
}
