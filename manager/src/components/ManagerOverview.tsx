import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

export function ManagerOverview() {

    const tempBarData = [
        { name: "Jan", value: 30 },
        { name: "Feb", value: 45 },
        { name: "Mar", value: 20 },
    ]
    const tempLineData = [
        { name: "Jan", value: 30 },
        { name: "Feb", value: 45 },
        { name: "Mar", value: 20 },
    ]

    return (
        <div className="overview-container">
            <BarChart width={300} height={300} data={tempBarData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
            </BarChart>
            <LineChart width={300} height={300} data={tempLineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" />
            </LineChart>
        </div>
    )
}