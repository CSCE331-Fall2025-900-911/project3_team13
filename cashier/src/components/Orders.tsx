import { useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import './Orders.css'
import dayjs from "dayjs";
import axios from 'axios';
import { useOrder } from '../OrderContext';
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
    const { loadOrder, markAsCompleted } = useOrder();
    
    // Ref to prevent double-loading in StrictMode
    const dataFetchedRef = useRef(false);

    const fetchItemData = async () => {
        const res = await axios.get(encodeURI(`https://project3-team13-backend.onrender.com/api/order-list`));
        console.log(res.data);
        setOrderData(res.data.orders.map((customerOrder: Order) => ({
            id: customerOrder.id,
            status: customerOrder.status,
            timestamp: dayjs(customerOrder.timestamp).format("MMM D, YYYY h:mm A"),
            customer_name: customerOrder.customer_name ? customerOrder.customer_name : "Guest",
        })));
    }
    
    useEffect(() => {
        // Prevent double-fetch in StrictMode
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

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
                    <h3>{item.customer_name}</h3>
                    <p>{item.status}</p>
                    <p>{item.timestamp}</p>

                    {/* Existing button */}
                    <Button variant='contained' onClick={() => loadOrder(item.id)}>
                    Add to Order
                    </Button>

                    {/* NEW conditional Completed button */}
                    {item.status === "in progress" && (
                    <Button
                        variant="contained"
                        color="success"
                        
                        onClick={async () => {
                            await markAsCompleted(item.id);
                            setOrderData(prev => prev?.filter(order => order.id !== item.id) ?? null);
                        }}
                    >
                        Completed
                    </Button>
                    )}
                </div>
            ))}
        </div>
    );
}