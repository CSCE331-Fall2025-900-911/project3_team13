import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import './ManagerReports.css'
import { Button, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export function ManagerReports() {
    const [trendStart, setTrendStart] = useState(null)
    const [trendEnd, setTrendEnd] = useState(null)
    const [trendItem, setTrendItem] = useState('')
    const [transactionStart, setTransactionStart] = useState(null)
    const [transactionEnd, setTransactionEnd] = useState(null)

    const tempLineData = [
            { name: "Jan", value: 30 },
            { name: "Feb", value: 45 },
            { name: "Mar", value: 20 },
        ]

    const OpenXReport = () => {
        alert("X Report")
    }

    const OpenZReport = () => {
        alert("Z Report")
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
        </div>
    )
}