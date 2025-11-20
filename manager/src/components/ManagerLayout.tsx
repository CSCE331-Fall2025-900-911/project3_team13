import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";

import "./ManagerLayout.css";

import { ManagerOverview } from "./ManagerOverview";
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
                {tabValue === "reports" && (
                    <div className="tab-content">
                        <h1>Reports Page</h1>
                    </div>
                )}
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