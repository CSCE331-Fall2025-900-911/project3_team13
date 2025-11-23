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
import { ManagerStore } from "./ManagerStore";

export function ManagerLayout() {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState<'overview' | 'reports' | 'store' | 'logout'>('overview');

    const Logout = () => {
        localStorage.setItem('username', '');
        localStorage.setItem('password', '');
        navigate('/');
    };

    // TEMP empty arrays — replace later
    const [inventory, setInventory] = useState<any[]>([]);
    const [menu, setMenu] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

    return (
        <div className="manager-layout">
            <div className="tab-panel">

                <Tabs 
                    value={tabValue} 
                    onChange={(_, v) => setTabValue(v)}
                    className="tabs"
                >
                    <Tab label="Overview" value="overview" />
                    <Tab label="Reports" value="reports" />
                    <Tab label="Manage Store" value="store" />
                    <Tab className="logout-tab" label="Logout" onClick={Logout} />
                </Tabs>

                {tabValue === "overview" && <ManagerOverview />}
                {tabValue === "reports" && <ManagerReports />}
                {tabValue === "store" && (
                    <ManagerStore
                        inventory={inventory}
                        menu={menu}
                        employees={employees}
                        setInventory={setInventory}
                        setMenu={setMenu}
                        setEmployees={setEmployees}
                    />
                )}
            </div>
        </div>
    );
}