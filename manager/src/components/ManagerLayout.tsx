import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import { EditorPopup } from './EditorPopup'; // import the separate popup
import './ManagerLayout.css';
import { ManagerOverview } from "./ManagerOverview"
import { ManagerReports} from "./ManagerReports"

type InventoryItem = { id: number; name: string; quantity: number };
type MenuItem = { id: number; name: string; category: string; price: number };
type Employee = { id: number; name: string; username: string; permissions: number };

export function ManagerLayout() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState<'overview' | 'reports' | 'store' | 'logout'>('overview');

  const Logout = () => {
    localStorage.setItem('username', '');
    localStorage.setItem('password', '');
    navigate('/');
  };

  // ==========================
  // INITIAL DATA
  // ==========================
  const inventoryDataInit: InventoryItem[] = [
    { id: 1, name: 'Boba', quantity: 364 },
    { id: 2, name: 'Green Tea', quantity: 100 },
    { id: 3, name: 'Black Tea', quantity: 104 },
    { id: 4, name: 'Milk', quantity: 280 },
    { id: 5, name: 'Sugar', quantity: 444 },
    { id: 6, name: 'Ice', quantity: 163 },
    { id: 7, name: 'Pudding', quantity: 114 },
    { id: 8, name: 'Lychee Jelly', quantity: 417 },
    { id: 9, name: 'Strawberry Syrup', quantity: 81 },
    { id: 10, name: 'Mango Syrup', quantity: 214 },
    { id: 11, name: 'Tapioca', quantity: 427 },
    { id: 12, name: 'Oolong Tea', quantity: 250 },
  ];

  const menuDataInit: MenuItem[] = [
    { id: 1, name: 'Classic Milk Tea', category: 'Milk Tea', price: 4.5 },
    { id: 2, name: 'Taro Milk Tea', category: 'Milk Tea', price: 9.5 },
    { id: 3, name: 'Matcha Latte', category: 'Milk Tea', price: 5.0 },
    { id: 4, name: 'Strawberry Smoothie', category: 'Specialty Drink', price: 6.5 },
    { id: 5, name: 'Brown Sugar Boba', category: 'Milk Tea', price: 5.5 },
  ];

  const employeeDataInit: Employee[] = [
    { id: 1, name: 'Allison Hill', username: 'allison_hill', permissions: 0 },
    { id: 2, name: 'Noah Rhodes', username: 'noah_rhodes', permissions: 0 },
    { id: 3, name: 'Angie Henderson', username: 'angie_henderson', permissions: 0 },
    { id: 4, name: 'Daniel Wagner', username: 'daniel_wagner', permissions: 1 },
    { id: 5, name: 'Cristian Santos', username: 'cristian_santos', permissions: 1 },
    { id: 6, name: 'Connie Lawrence', username: 'connie_lawrence', permissions: 1 },
    { id: 7, name: 'Abigail Shaffer', username: 'abigail_shaffer', permissions: 1 },
    { id: 8, name: 'Gina Moore', username: 'gina_moore', permissions: 0 },
    { id: 9, name: 'Gabrielle Davis', username: 'gabrielle_davis', permissions: 0 },
    { id: 10, name: 'Ryan Munoz', username: 'ryan_munoz', permissions: 0 },
    { id: 11, name: 'Monica Herrera', username: 'monica_herrera', permissions: 1 },
    { id: 12, name: 'Jamie Arnold', username: 'jamie_arnold', permissions: 0 },
  ];

  // ==========================
  // STATE
  // ==========================
  const [inventory, setInventory] = useState<InventoryItem[]>(inventoryDataInit);
  const [menu, setMenu] = useState<MenuItem[]>(menuDataInit);
  const [employees, setEmployees] = useState<Employee[]>(employeeDataInit);
  const [popup, setPopup] = useState<null | 'inventory' | 'menu' | 'employees'>(null);

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="manager-layout">
      <div className="tab-panel">
        <div className="tabs">
          <Tabs value={tabValue} onChange={(__, newValue) => setTabValue(newValue)}>
            <Tab label="Overview" value="overview" />
            <Tab label="Reports" value="reports" />
            <Tab label="Manage Store" value="store" />
            <Tab className="logout-tab" label="Logout" onClick={Logout} />
          </Tabs>
        </div>

        {tabValue === 'overview' && <div className="tab-content"><h1>Manager Overview Page</h1></div>}
        {tabValue === 'reports' && <div className="tab-content">
          <ManagerReports />
          </div>}

        {tabValue === 'store' && (
          <div className="tab-content">
            <h1>Manage Store Page</h1>

            {/* Inventory */}
            <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>Inventory / Stock</Typography>
            <Paper sx={{ overflow: 'hidden', mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Button variant="contained" sx={{ mb: 4 }} onClick={() => setPopup('inventory')}>Edit Inventory</Button>

            {/* Menu */}
            <Typography variant="h5" sx={{ mb: 1 }}>Menu Items</Typography>
            <Paper sx={{ overflow: 'hidden', mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menu.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Button variant="contained" sx={{ mb: 4 }} onClick={() => setPopup('menu')}>Edit Menu</Button>

            {/* Employees */}
            <Typography variant="h5" sx={{ mb: 1 }}>Employees</Typography>
            <Paper sx={{ overflow: 'hidden', mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Permissions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map(emp => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.id}</TableCell>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.username}</TableCell>
                      <TableCell>{emp.permissions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Button variant="contained" sx={{ mb: 2 }} onClick={() => setPopup('employees')}>Edit Employees</Button>

            {/* Popups */}
            {popup === 'inventory' && (
              <EditorPopup
                open
                title="Edit Inventory"
                data={inventory}
                setData={setInventory}
                onClose={() => setPopup(null)}
              />
            )}
            {popup === 'menu' && (
              <EditorPopup
                open
                title="Edit Menu Items"
                data={menu}
                setData={setMenu}
                onClose={() => setPopup(null)}
              />
            )}
            {popup === 'employees' && (
              <EditorPopup
                open
                title="Edit Employees"
                data={employees}
                setData={setEmployees}
                onClose={() => setPopup(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}