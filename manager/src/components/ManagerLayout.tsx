import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
  Tabs,
  Tab,
} from '@mui/material';
import './ManagerLayout.css';
import { ManagerOverview } from "./ManagerOverview"


export function ManagerLayout() {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState<'overview' | 'reports' | 'store' | 'logout'>('overview');

    const Logout = () => {
        localStorage.setItem('username', '');
        localStorage.setItem('password', '');
        navigate('/');
    };

    return (
        <div className="manager-layout">
            <div className="tab-panel">
            <div className="tabs">
                <Tabs value={tabValue} onChange={(__, newValue) => setTabValue(newValue)}>
                    <Tab label="Overview" value="overview" />
                    <Tab label="Reports" value="reports" />
                    <Tab label="Manage Store" value="store" />
                    <Tab className='logout-tab' label="Logout" onClick={Logout}/>
                </Tabs>
            </div>

            {tabValue === 'overview' && <div className="tab-content">
                <ManagerOverview />
            </div>}
            {tabValue === 'reports' && <div className="tab-content">
                <h1>Reports Page</h1>
            </div>}
            {tabValue === 'store' && <div className="tab-content">
                <h1>Manage Store Page</h1>
            </div>}
            </div>
        </div>
    );
}