import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import './ManagerReports.css'
import { Button, TextField } from '@mui/material'

export function ManagerReports() {
    const [trendStart, setTrendStart] = useState('')
    const [trendEnd, setTrendEnd] = useState('')
    const [trendItem, setTrendItem] = useState('')
    const [transactionStart, setTransactionStart] = useState('')
    const [transactionEnd, setTransactionEnd] = useState('')

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
                <Button variant='contained' onClick={OpenXReport}>X Report</Button>
                <Button variant='contained' onClick={OpenZReport}>Z Report</Button>
            </div>
            <div className='trends'>
                <div className='trends-input'>
                    <TextField
                        label="Start Date"
                        value={trendStart}
                        onChange={(e) => setTrendStart(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="End Date"
                        value={trendEnd}
                        onChange={(e) => setTrendEnd(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="Item Name"
                        value={trendItem}
                        onChange={(e) => setTrendItem(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </div>
                <div className='trends-graph'>
                    <LineChart width={300} height={300} data={tempLineData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" />
                    </LineChart>
                </div>
            </div>
            <div className='transactions'>
                <div className='transactions-graph'>
                    <LineChart width={300} height={300} data={tempLineData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" />
                    </LineChart>
                </div>
                <div className='transactions-input'>
                    <TextField
                        label="Start date"
                        value={transactionStart}
                        onChange={(e) => setTransactionStart(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="End date"
                        value={transactionEnd}
                        onChange={(e) => setTransactionEnd(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </div>
            </div>
        </div>
    )
}