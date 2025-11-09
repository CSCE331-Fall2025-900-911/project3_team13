const express = require('express');
const pool = require('./db/pool');
const dotenv = require('dotenv');



dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());


// Routes
app.use('/item-editing', require('./routes/itemEditingRoute'));
app.use('/new-order', require('./routes/newOrderRoute'));
app.use('/add-customer', require('./routes/addCustomerRoute'));
app.use('/add-modified-menu-item', require('./routes/addModifiedMenuItemRoute'));

//shutdown hook
process.on('SIGINT', () => {
  pool.end();
  console.log('Application successfully shutdown');
  process.exit(0);
});


app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
