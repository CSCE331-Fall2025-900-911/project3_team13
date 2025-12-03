import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import './Orders.css'
import dayjs from "dayjs";
import axios from 'axios';

interface Order {
    id: number;
    status: string;
    timestamp: string;
    customer_name: string;
    items?: [
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
        const res = await axios.get(encodeURI(`http://localhost:3000/api/order-list?status=pending`));
        console.log(res.data);
        setOrderData(res.data.orders.map((customerOrder: Order) => ({
            orderId: customerOrder.id,
            status: customerOrder.status,
            timestamp: dayjs(customerOrder.timestamp).format("MMM D, YYYY h:mm A"),
            customerName: customerOrder.customer_name
            // items: customerOrder.items
        })));
    }

    async function orderToSummary(orderId: number) {
        await axios.post(encodeURI(`http://localhost:3000/api/load-order?id=${orderId}`))
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
                <div className='order-item-card' key={item.id}>
                    <h2>{item.customer_name}</h2>
                    <p>{item.status}</p>
                    <p>{item.timestamp}</p>
                    <Button variant='contained' onClick={() => orderToSummary(item.id)}>Add to Order</Button>
                </div>
            ))}
        </div>
    );
}