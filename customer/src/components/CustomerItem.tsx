import { Box, Typography, Card, CardMedia, CardContent, Button } from '@mui/material';

export default function CustomerItem() {
  return (
    <Box padding={2} display="flex" justifyContent="center">
      <Card sx={{ width: 300 }}>
        <CardMedia
          component="img"
          height="180"
          image="https://via.placeholder.com/300x180.png?text=Drink"
          alt="Drink"
        />
        <CardContent>
          <Typography variant="h6">Sample Drink</Typography>
          <Typography variant="body2">Delicious bubble tea with tapioca pearls.</Typography>
          <Button variant="contained" sx={{ mt: 1 }}>Modify</Button>
        </CardContent>
      </Card>
    </Box>
  );
}
