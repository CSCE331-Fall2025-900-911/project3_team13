-- Drop existing tables in dependency-safe order
DROP TABLE IF EXISTS item_editing_table;
DROP TABLE IF EXISTS menu_item_order;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_item_inventory;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS customers;

-- ==========================
-- TABLE DEFINITIONS
-- ==========================

CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    payment VARCHAR(50)
);


CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    permissions INT NOT NULL CHECK (permissions IN (0, 1))
);


CREATE TABLE IF NOT EXISTS inventory (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL
);


CREATE TABLE menu_items (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    modifications TEXT  -- store the JSON-like string here
);

--MenuItem_Inventory (junction)
CREATE TABLE IF NOT EXISTS menu_item_inventory (
    menuitemid INT NOT NULL,
    inventoryid INT NOT NULL,
    PRIMARY KEY (menuitemid, inventoryid),
    FOREIGN KEY (menuitemid) REFERENCES menu_items(id),
    FOREIGN KEY (inventoryid) REFERENCES inventory(id)
);

--Orders
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY,
    status BOOLEAN NOT NULL,
    timestamp TIMESTAMP NOT NULL
);

--  Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY,
    customerid INT NOT NULL,
    employeeid INT NOT NULL,
    total DECIMAL(8,2) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (customerid) REFERENCES customers(id),
    FOREIGN KEY (employeeid) REFERENCES employees(id),
    FOREIGN KEY (id) REFERENCES orders(id) ON DELETE CASCADE
);

-- MenuItem_Order (junction)
CREATE TABLE IF NOT EXISTS menu_item_order (
    id INT PRIMARY KEY,
    menuitemid INT NOT NULL,
    orderid INT NOT NULL,
    FOREIGN KEY (menuitemid) REFERENCES menu_items(id),
    FOREIGN KEY (orderid) REFERENCES orders(id)
);

-- ItemEditingTable (customizations)
CREATE TABLE item_editing_table (
    comboid INT NOT NULL,
    Sugar VARCHAR(50) NOT NULL,
    Ice VARCHAR(50) NOT NULL,
    Size VARCHAR(50) NOT NULL,
    Shots VARCHAR(50) NOT NULL,
    Notes TEXT,
    PRIMARY KEY (comboid),
    FOREIGN KEY (comboid) REFERENCES menu_item_order(id)
);


\copy customers              FROM 'customers.csv'           CSV HEADER;
\copy employees              FROM 'employees.csv'           CSV HEADER;
\copy inventory              FROM 'inventory.csv'           CSV HEADER;
\copy menu_items             FROM 'menu_items.csv'          CSV HEADER;
\copy menu_item_inventory    FROM 'menu_item_inventory.csv' CSV HEADER;
\copy orders                 FROM 'orders.csv'              CSV HEADER;
\copy transactions           FROM 'transactions.csv'        CSV HEADER;
\copy menu_item_order        FROM 'menu_item_order.csv'     CSV HEADER;
\copy item_editing_table     FROM 'item_editing_table.csv'  CSV HEADER;
