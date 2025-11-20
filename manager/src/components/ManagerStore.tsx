import { useState } from 'react';
import {
    Paper, Table, TableHead, TableBody, TableRow, TableCell,
    Button, Typography
} from '@mui/material';
import { EditorPopup } from './EditorPopup';

type InventoryItem = { id: number; name: string; quantity: number };
type MenuItem = { id: number; name: string; category: string; price: number };
type Employee = { id: number; name: string; username: string; permissions: number };

interface ManagerStoreProps {
    inventory: InventoryItem[];
    menu: MenuItem[];
    employees: Employee[];
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
    setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

export function ManagerStore({
    inventory,
    menu,
    employees,
    setInventory,
    setMenu,
    setEmployees
}: ManagerStoreProps) {

    const [popup, setPopup] = useState<null | 'inventory' | 'menu' | 'employees'>(null);

    return (
        <div className="tab-content">
            <h1>Manage Store Page</h1>

            {/* INVENTORY */}
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
            <Button variant="contained" sx={{ mb: 4 }} onClick={() => setPopup('inventory')}>
                Edit Inventory
            </Button>

            {/* MENU */}
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
            <Button variant="contained" sx={{ mb: 4 }} onClick={() => setPopup('menu')}>
                Edit Menu
            </Button>

            {/* EMPLOYEES */}
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
            <Button variant="contained" sx={{ mb: 2 }} onClick={() => setPopup('employees')}>
                Edit Employees
            </Button>

            {/* POPUPS */}
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
    );
}