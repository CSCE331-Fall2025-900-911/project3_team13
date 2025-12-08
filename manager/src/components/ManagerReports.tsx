import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
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

type LineDataPoint = {
    name: string,
    value: number
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

    const [trendData, setTrendData] = useState<LineDataPoint[]>([])
    const [transactionData, setTransactionData] = useState<LineDataPoint[]>([])

    const OpenXReport = async () => {
        try {
            const res = await axios.get<XReport>("https://project3-team13-backend.onrender.com/api/get-x-report", { timeout: 1000 });
            setXReportData({
                totalSales: res.data.totalSales,
                cancellations: res.data.cancellations,
                usedPoints: res.data.usedPoints
            });
            setXOpen(true)
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
            const res = await axios.get<ZReport>("https://project3-team13-backend.onrender.com/api/get-z-report", { timeout: 1000 });
            setZReportData({
                totalSales: res.data.totalSales,
                numCustomers: res.data.numCustomers,
                numTransactions: res.data.numTransactions
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

    const fetchTrendData = async () => {
        if (!trendStart || !trendEnd) return
        try {
            const res = await axios.get<LineDataPoint[]>('https://project3-team13-backend.onrender.com/api/manager-analytics/trends', {
                params: {
                    startDate: trendStart.format('YYYY-MM-DD'),
                    endDate: trendEnd.format('YYYY-MM-DD'),
                    itemName: trendItem || undefined
                }
            });
            setTrendData(res.data);
        } catch (err) {
            console.error('Failed to fetch trend data:', err);
            setTrendData([]);
        }
    }

    const fetchTransactionData = async () => {
        if (!transactionStart || !transactionEnd) return
        try {
            const res = await axios.get<LineDataPoint[]>('https://project3-team13-backend.onrender.com/api/manager-analytics/transactions', {
                params: {
                    startDate: transactionStart.format('YYYY-MM-DD'),
                    endDate: transactionEnd.format('YYYY-MM-DD')
                }
            });
            setTransactionData(res.data);
        } catch (err) {
            console.error('Failed to fetch transaction data:', err);
            setTransactionData([]);
        }
    }

    useEffect(() => {
        fetchTrendData();
        fetchTransactionData();

        // Auto-refresh every 10 seconds
        const interval = setInterval(() => {
            fetchTrendData();
            fetchTransactionData();
        }, 10000);

        return () => clearInterval(interval);
    }, [trendStart, trendEnd, trendItem, transactionStart, transactionEnd]);

    return (
        <div className="reports-container">
            <div className='report-buttons'>
                <Button className='button' variant='contained' onClick={OpenXReport}>X Report</Button>
                <Button className='button' variant='contained' onClick={OpenZReport}>Z Report</Button>
            </div>
            <hr />
            <div className='trends'>
                <div className='trends-input'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date"
                            value={trendStart}
                            onChange={setTrendStart}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="End Date"
                            value={trendEnd}
                            onChange={setTrendEnd}
                        />
                    </LocalizationProvider>
                    <TextField 
                        label='Menu Item'
                        value={trendItem}
                        onChange={(e) => setTrendItem(e.target.value)}
                    />
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">Order Trends</h2>
                <div className="trends-graph">
                    <h2 style={{ color: 'black', textAlign: 'center', marginBottom: '10px' }}>
                        Order Trends
                    </h2>
                    <LineChart width={400} height={200} data={trendData}>
                        <XAxis 
                            dataKey="name" 
                            tick={{ fill: 'black' }} 
                            axisLine={{ stroke: 'black' }}
                            tickLine={{ stroke: 'black' }}
                            label={{ value: "Date", position: "insideBottom", offset: -5, fill: "black" }}
                        />
                        <YAxis 
                            tick={{ fill: 'black' }}
                            axisLine={{ stroke: 'black' }}
                            tickLine={{ stroke: 'black' }}
                            label={{ value: "Items Sold", angle: -90, position: "insideLeft", fill: "black" }}
                        />
                        <Tooltip 
                            contentStyle={{ color: 'black', backgroundColor: 'white' }}
                            labelStyle={{ color: 'black' }}
                            itemStyle={{ color: 'black' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="black" />
                    </LineChart>
                </div>
            </div>
            <hr />
            <div className='transactions'>
                <h2 className="text-xl font-bold mb-2 text-center">Sales History</h2>
                <div className="transactions-graph">
                    <h2 style={{ color: 'black', textAlign: 'center', marginBottom: '10px' }}>
                        Sales History
                    </h2>

                    <LineChart width={400} height={200} data={transactionData}>
                        <XAxis 
                            dataKey="name" 
                            tick={{ fill: 'black' }} 
                            axisLine={{ stroke: 'black' }}
                            tickLine={{ stroke: 'black' }}
                            label={{ value: "Date", position: "insideBottom", offset: -5, fill: "black" }}
                        />
                        <YAxis 
                            tick={{ fill: 'black' }} 
                            axisLine={{ stroke: 'black' }}
                            tickLine={{ stroke: 'black' }}
                            label={{ value: "Revenue ($)", angle: -90, position: "insideLeft", fill: "black" }}
                        />
                        <Tooltip 
                            contentStyle={{ color: 'black', backgroundColor: 'white' }}
                            labelStyle={{ color: 'black' }}
                            itemStyle={{ color: 'black' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="black" />
                    </LineChart>
                </div>
                <div className='transactions-input'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start Date"
                            value={transactionStart}
                            onChange={setTransactionStart}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="End Date"
                            value={transactionEnd}
                            onChange={setTransactionEnd}
                        />
                    </LocalizationProvider>
                </div>
            </div>
            <Dialog open={xOpen} onClose={() => setXOpen(false)}>
                <div className='report-dialog'>
                    <h1>X Report</h1>
                    <h3>Total Sales: {xReportData?.totalSales}</h3>
                    <h3>Cancellations: {xReportData?.cancellations}</h3>
                    <h3>Award Points Used: {xReportData?.usedPoints}</h3>
                </div>
            </Dialog>
            <Dialog open={zOpen} onClose={() => setZOpen(false)}>
                <div className='report-dialog'>
                    <h1>Z Report</h1>
                    <h3>Total Sales: {zReportData?.totalSales}</h3>
                    <h3>Customers: {zReportData?.numCustomers}</h3>
                    <h3>Transactions: {zReportData?.numTransactions}</h3>
                </div>
            </Dialog>
        </div>
    )
}