import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import './ManagerReports.css'
import { Button, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import type { Dayjs } from 'dayjs';

type XReport = {
    totalSales: number,
    cancellations: number,
    usedPoints: number
}

type ZReport = {
    totalSales: number,
    numTransactions: number,
    numCustomers: number
}

export function ManagerReports() {
    const [trendStart, setTrendStart] = useState<Dayjs | null>(null)
    const [trendEnd, setTrendEnd] = useState<Dayjs | null>(null)
    const [trendItem, setTrendItem] = useState('')
    const [transactionStart, setTransactionStart] = useState<Dayjs | null>(null)
    const [transactionEnd, setTransactionEnd] = useState<Dayjs | null>(null)

    const [xReportData, setXReportData] = useState<XReport | null>(null)
    const [zReportData, setZReportData] = useState<ZReport | null>(null)
    const [xOpen, setXOpen] = useState(false)
    const [zOpen, setZOpen] = useState(false)

    const tempLineData = [
            { name: "Jan", value: 30 },
            { name: "Feb", value: 45 },
            { name: "Mar", value: 20 },
        ]

    const OpenXReport = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/get-x-report", { timeout: 1000 });
            setXReportData({
                totalSales: 0,
                cancellations: 0,
                usedPoints: 0
            });
            setZOpen(true)
        } catch (err) {
            console.error("Failed to fetch X report:", err);
            setXReportData({
                totalSales: 0,
                cancellations: 0,
                usedPoints: 0
            });
            setXOpen(true)
        }
    }

    const OpenZReport = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/get-z-report", { timeout: 1000 });
            setZReportData({
                totalSales: 0,
                numCustomers: 0,
                numTransactions: 0
            });
            setZOpen(true)
        } catch (err) {
            console.error("Failed to fetch Z report:", err);
            setZReportData({
                totalSales: 0,
                numCustomers: 0,
                numTransactions: 0
            });
            setZOpen(true)
        }
    }

    return (
        <div className="reports-container">
            <div className='report-buttons'>
                <Button className='button' variant='contained' onClick={OpenXReport}>X Report</Button>
                <Button className='button' variant='contained' onClick={OpenZReport}>Z Report</Button>
            </div>
            <hr></hr>
            <div className='trends'>
                <div className='trends-input'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            
                            label="Start Date"
                            value={trendStart}
                            onChange={(newValue) => setTrendStart(newValue)}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            
                            label="End Date"
                            value={trendEnd}
                            onChange={(newValue) => setTrendEnd(newValue)}
                        />
                    </LocalizationProvider>
                    <TextField 
                        label='Menu Item'
                        value={trendItem}
                        onChange={(e) => setTrendItem(e.target.value)}
                    />
                </div>
                <div className='trends-graph'>
                    <LineChart width={600} height={300} data={tempLineData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" />
                    </LineChart>
                </div>
            </div>
            <hr></hr>
            <div className='transactions'>
                <div className='transactions-graph'>
                    <LineChart width={600} height={300} data={tempLineData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" />
                    </LineChart>
                </div>
                <div className='transactions-input'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            
                            label="Start Date"
                            value={transactionStart}
                            onChange={(newValue) => setTransactionStart(newValue)}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            
                            label="End Date"
                            value={transactionEnd}
                            onChange={(newValue) => setTransactionEnd(newValue)}
                        />
                    </LocalizationProvider>
                </div>
            </div>
            <Dialog open={xOpen} onClose={() => setXOpen(false)}>
                <h1>X Report</h1>
                <h3>Total Sales: {xReportData?.totalSales}</h3>
                <h3>Cancellations: {xReportData?.cancellations}</h3>
                <h3>Award Points Used: {xReportData?.totalSales}</h3>
            </Dialog>
            <Dialog open={zOpen} onClose={() => setZOpen(false)}>
                <h1>Z Report</h1>
                <h3>Total Sales: {zReportData?.totalSales}</h3>
                <h3>Customers: {zReportData?.numCustomers}</h3>
                <h3>Transactions: {zReportData?.numTransactions}</h3>
            </Dialog>
        </div>
    )
}