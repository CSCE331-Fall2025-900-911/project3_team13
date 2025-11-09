import { Box, Typography, Checkbox, FormGroup, FormControlLabel, Button, Modal } from '@mui/material';
import './Customer.css';

interface CustomerModifyProps {
  open: boolean;
  onClose: () => void;
}

export default function CustomerModify({ open, onClose }: CustomerModifyProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: 400,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" mb={2}>
          Customize Your Drink
        </Typography>

        <FormGroup>
          <FormControlLabel control={<Checkbox />} label="Less Sugar" />
          <FormControlLabel control={<Checkbox />} label="Extra Ice" />
          <FormControlLabel control={<Checkbox />} label="Tapioca" />
          <FormControlLabel control={<Checkbox />} label="Pudding" />
        </FormGroup>

        <Button variant="contained" sx={{ mt: 2 }}>
          Add to Cart
        </Button>

        <Button sx={{ mt: 1 }} onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}