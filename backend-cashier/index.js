const express = require('express');
const pool = require('./db/pool');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = 3000;

// change origin link to deployment link when deploying
const corsConfig = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json());
app.use(cors(corsConfig));

// Routes
app.use('/api/new-order', require('./routes/newOrderRoute'));
app.use('/api/add-customer', require('./routes/addCustomerRoute'));
app.use('/api/link-customer-to-order', require('./routes/linkCustomerToOrder'));
app.use('/api/add-modified-menu-item', require('./routes/addModifiedMenuItemRoute'));
app.use('/api/delete-menu-item', require('./routes/deleteMenuItems'));
app.use('/api/cart', require('./routes/cartRoute'));
app.use('/api/get-menu-items', require('./routes/getMenuItemsRoute'));

//shutdown hook
process.on('SIGINT', () => {
  pool.end();
  console.log('Application successfully shutdown');
  process.exit(0);
});


app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
