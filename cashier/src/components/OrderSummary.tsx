//import {dummyItems, formatPrice} from '../data/dummyItems';
//import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import './OrderSummary.css';
//import axios from "axios";
import reactIcon from '../assets/react.svg';
import { useOrder } from '../OrderContext';

/*
interface OrderItem {
    comboId: number;
    name: string;
    price: number;
}

interface OrderData {
    orderId: number;
    orderItems: {
        comboId: number;
        drink_name: string;
        price: number;
    }[];
} */

export function OrderSummary({ orderIdentifier }: { orderIdentifier: number }) {
    const { orderItems, deleteItemFromOrder } = useOrder();
    const totalPrice = orderItems.reduce((total, item) => total + item.price, 0);
    //const [OrderData, setOrderData] = useState<OrderData["orderItems"]>([]);
    //const [isLoading, setIsLoading] = useState(true);
    //const totalPrice = OrderData ? OrderData.reduce((total, item) => total + item.price, 0) : 0;

    if(orderItems.length === 0) {
        return <div>No order data available.</div>;
    }

    /**
    async function fetchOrderData(): Promise<OrderData> {
        { For testing only, REMOVE FOR DEPLOYMENT }
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

        { Actual fetch code for deployment }
        
        const response = await axios.get('http://localhost:3000/api/cart?orderID=' + orderIdentifier);
        const data = response.data;
        const orderItems = data.items.map((item: OrderItem) => ({
            comboId: item.comboId,
            drink_name: item.name,
            price: item.price
        }));
        return { orderId: data.orderId, orderItems };
    }

    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                const data = await fetchOrderData();
                setOrderData(data.orderItems); 
            } catch (error) {
                console.error("Error fetching order data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        if(orderIdentifier){
            loadData();
        }
    }, [orderIdentifier]) */

    /*
    if (isLoading) {
        return <div>Loading order summary...</div>;
    } */

    /*
    if (!OrderData || OrderData.length == 0) {
        return <div>No order data available.</div>;
    } */
    console.log(orderItems.map(i => ({ id: i.id, price: i.price, type: typeof i.price })));
    return (
        <div>
            <h3>Order Total = ${totalPrice.toFixed(2)}</h3>
            <div className = "order-items">
                {orderItems.map((orderItem) => (
                    <div key={orderItem.id} className="order-item">
                        <img src={reactIcon} alt='' />
                        <div className="item-details">
                            <div className="item-header">
                                <span className="item-name">{orderItem.name}</span>
                                <span className="item-price">${orderItem.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className='x-button'>
                            <IconButton onClick={() => deleteItemFromOrder(orderItem.id)}> X </IconButton>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
    
}
