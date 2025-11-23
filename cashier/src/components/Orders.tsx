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
    items: [
        {
            comboId: number,
            menuItemId: number,
            menuItemName: string,
            modifications: {
                Sugar: string,
                Ice: string,
                Size: string,
                Shots: string, 
                Notes: string
            }
        }
    ]
}

export function Orders() {
    const [orderData, setOrderData] = useState<Order[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchItemData = async () => {
        const res = await axios.get(encodeURI(`https://project3-team13-backend.onrender.com/api/order-list?`));
        setOrderData(res.data.drinks.map((customerOrder: Order) => ({
            orderId: customerOrder.orderId,
            status: customerOrder.status,
            timestamp: dayjs(customerOrder.timestamp).format("MMM D, YYYY h:mm A"),
            customerName: customerOrder.customerName,
            items: customerOrder.items
        })));
    }

    async function orderToSummary(orderId: number) {
        await axios.post(encodeURI(`https://project3-team13-backend.onrender.com/api/load-order?id=${orderId}`))
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
                    <Button variant='contained' onClick={() => orderToSummary(item.orderId)}>Add to Order</Button>
                </div>
            ))}
        </div>
    );
}