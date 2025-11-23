import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import './Orders.css'
import dayjs from "dayjs";
import axios from 'axios';

interface Order {
    orderId: number;
    customerName: string;
    status: string;
    timestamp: string;
}

export function Orders() {
    const [orderData, setOrderData] = useState<Order[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const dummyOrders = [
    {
        orderId: 1,
        customerName: "John Doe",
        status: "Completed",
        timestamp: "2025-01-12T14:05:00Z"
    },
    {
        orderId: 2,
        customerName: "Sarah Smith",
        status: "In Progress",
        timestamp: "2025-01-12T14:20:00Z"
    }
    ];

    const fetchItemData = async () => {
        // const res = await axios.get(encodeURI(`http://localhost:3000/api/order-list?`));
        // setOrderData(res.data.drinks.map((customerOrder: Order) => ({
        //     orderId: customerOrder.orderId,
        //     customerName: customerOrder.customerName,
        //     status: customerOrder.status,
        //     timestamp: dayjs(customerOrder.timestamp).format("MMM D, YYYY h:mm A")
        // })));
        // TEMPORARY: use dummy data instead of API call
        setOrderData(dummyOrders.map((o) => ({
            orderId: o.orderId,
            customerName: o.customerName,
            status: o.status,
            timestamp: dayjs(o.timestamp).format("MMM D, YYYY h:mm A")
        })));
    }

    async function orderToSummary() {
        await axios.post(encodeURI(`http://localhost:3000/api/load-order?id={orderId}`))
    }
    
    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                await fetchItemData();
            } catch (error) {
                console.error("Error fetching order data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [])

    if (isLoading) {
        return <div>Loading order page...</div>;
    }

    if (!orderData || orderData.length == 0) {
        return <div>No order data available.</div>;
    }

    return (
        <div className='orders-container'>
            {orderData.map((item) => (
                <div className='order-item-card'>
                    <h2>{item.customerName}</h2>
                    <p>{item.status}</p>
                    <p>{item.timestamp}</p>
                    <Button variant='contained' onClick={() => alert("Hi!")}>Add to Order</Button>
                </div>
            ))}
        </div>
    );
}