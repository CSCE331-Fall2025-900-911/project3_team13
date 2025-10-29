DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS transactions;

CREATE TABLE IF NOT EXISTS inventory (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL
);
CREATE TABLE IF NOT EXISTS menu_items (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    series VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    ingredients VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS customers (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_num INT NOT NULL,
    history VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS orders (
    id INT NOT NULL PRIMARY KEY,
    itemlist VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS transactions (
    id INT NOT NULL PRIMARY KEY,
    customer_id INT NOT NULL,
    total DECIMAL(8,2) NOT NULL,
    timestamp TIMESTAMP NOT NULL
);

\copy customers from 'customers.csv' CSV HEADER
\copy inventory from 'inventory.csv' CSV HEADER
\copy menu_items from 'menu_items.csv' CSV HEADER
\copy orders from 'orders.csv' CSV HEADER
\copy transactions from 'transactions.csv' CSV HEADER