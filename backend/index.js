const express = require('express');
const pool = require('./db/pool');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = 3000;

// change origin link to deployment link when deploying
const corsConfig = {
  origins: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(express.json());
app.use(cors(corsConfig));

const session = require('express-session');
const passport = require('passport');


app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/new-order', require('./routes/newOrderRoute'));
app.use('/api/add-customer', require('./routes/addCustomerRoute'));
app.use('/api/link-customer-to-order', require('./routes/linkCustomerToOrder'));
app.use('/api/add-modified-menu-item', require('./routes/addModifiedMenuItemRoute'));
app.use('/api/delete-menu-item', require('./routes/deleteMenuItems'));
app.use('/api/cart', require('./routes/cartRoute'));
app.use('/api/get-menu-items', require('./routes/getMenuItemsRoute'));
app.use('/api/get-all-items', require('./routes/getAllItemsRoute'));
app.use('/api/checkout', require('./routes/checkoutRoute'));
app.use('/api/order-list', require('./routes/orderList'));
app.use('/api/get-x-report', require('./routes/getXReportInfoRoute'));
app.use('/api/get-z-report', require('./routes/getZReportInfoRoute'));
app.use('/api/store', require('./routes/getStoreData'));
app.use('/api/translate', require('./routes/translateRoute'));
app.use('/auth', require('./routes/authRoute'));
app.use('/api/inventory', require('./routes/managerInventoryRoutes'));
app.use('/api/employees', require('./routes/managerEmployeeRoutes'));
app.use('/api/manager-analytics', require('./routes/managerAnalyticsRoutes'));
app.use('/api/customers', require('./routes/getCustomerPoints'));
app.use('/api/customers', require('./routes/redeemCustomerPoints'));

app.use('/api/weather', require('./routes/getWeatherData'));

//manager update
app.use('/api/update-menu-item', require('./routes/updateMenuItem'));


//shutdown hook
process.on('SIGINT', () => {
  pool.end();
  console.log('Application successfully shutdown');
  process.exit(0);
});


app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
