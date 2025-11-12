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

    return (
        <div>
            <h3>Order Total = ${totalPrice}</h3>
            <div className = "order-items">
                {orderItems.map((orderItem) => (
                    <div key={orderItem.comboId} className="order-item">
                        <img src={reactIcon} alt='' />
                        <div className="item-details">
                            <div className="item-header">
                                <span className="item-name">{orderItem.name}</span>
                                <span className="item-price">${orderItem.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className='x-button'>
                            <IconButton onClick={() => deleteItemFromOrder(orderItem.comboId)}> X </IconButton>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
    
}
