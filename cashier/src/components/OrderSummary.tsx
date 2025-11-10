//import {dummyItems, formatPrice} from '../data/dummyItems';
import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import './OrderSummary.css';


interface OrderItem {
    itemId: number;
    name: string;
    price: number;
    modifications?: string[];
    iconUrl: string;
}

export function OrderSummary() {
    const [OrderData, setOrderData] = useState<OrderItem[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const totalPrice = OrderData ? OrderData.reduce((total, item) => total + item.price, 0) : 0;

    async function fetchOrderData(): Promise<OrderItem[]> {
        { /* For testing only, REMOVE FOR DEPLOYMENT */ }
        // return new Promise((resolve) => {
        //     setTimeout(() => {
        //         const items = dummyItems.map(item => ({
        //             itemId: item.id,
        //             name: item.name,
        //             price: item.price,
        //             iconUrl: item.icon,
        //             modifications: item.modifications
        //         }));
        //         resolve(items);
        //     }, 1000); // Simulate network delay
        // });

        { /* Actual fetch code for deployment */ }
        
        try {
            const response = await axios.get('http://localhost:3000/api/cart');
            const data = await response.json();
            return data.map((item: any) => ({
                itemId: item.id,
                name: item.name,
                price: item.price,
                iconUrl: item.iconUrl,
                modifications: item.modifications
            }));
        } catch (error) {
            console.error("Error fetching order data:", error);
            return [];
        }
    }

    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                const data = await fetchOrderData();
                setOrderData(data); 
            } catch (error) {
                console.error("Error fetching order data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [])

    if (isLoading) {
        return <div>Loading order summary...</div>;
    }

    if (!OrderData || OrderData.length == 0) {
        return <div>No order data available.</div>;
    }

    return (
        <div>
            <h3>Order Total = ${totalPrice.toFixed(2)}</h3>
            <div className = "order-items">
                {OrderData.map((orderItem) => (
                    <div key={orderItem.itemId} className="order-item">
                        <img src={orderItem.iconUrl} alt='' />
                        <div className="item-details">
                            <div className="item-header">
                                <span className="item-name">{orderItem.name}</span>
                                <span className="item-price">${orderItem.price.toFixed(2)}</span>
                            </div>
                            <p className="item-modifications">
                                {orderItem.modifications ? orderItem.modifications.join(', ') : 'No modifications'}
                            </p>
                        </div>
                        <div className='x-button'>
                            <IconButton onClick={() => console.log("Edit clicked")}> X </IconButton>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
    
}
