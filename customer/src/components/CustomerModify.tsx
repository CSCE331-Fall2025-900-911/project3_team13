import { Box, Typography, Checkbox, FormGroup, FormControlLabel, Button } from '@mui/material';

export default function CustomerModify() {
  return (
    <Box padding={2}>
      <Typography variant="h5" mb={2}>Customize Your Drink</Typography>
      <FormGroup>
        <FormControlLabel control={<Checkbox />} label="Less Sugar" />
        <FormControlLabel control={<Checkbox />} label="Extra Ice" />
        <FormControlLabel control={<Checkbox />} label="Tapioca" />
        <FormControlLabel control={<Checkbox />} label="Pudding" />
      </FormGroup>
      <Button variant="contained" sx={{ mt: 2 }}>Add to Cart</Button>
    </Box>
  );
}