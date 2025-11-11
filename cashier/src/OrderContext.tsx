import axios from 'axios';
import { createContext, useContext, useState } from 'react';

export interface OrderItem {
    id: number;
    name: string;
    price: number;
    ice: string;
    sugar: string;
    size: 'Small' | 'Medium' | 'Large';
    extraShots: string;
    notes: string;
}

export const OrderContext = createContext<{
    orderId: number;
    orderStatus: 'pending' | 'completed' | 'cancelled';
    orderItems: OrderItem[];
    createOrder: () => Promise<number | null>;
    completeOrder: () => Promise<void>;
    cancelOrder: () => Promise<void>;
    addItemToOrder: (item: OrderItem) => void;
    deleteItemFromOrder: (itemId: number) => void;
} | undefined>(undefined);

export function useOrder() {
    const context = useContext(OrderContext);
    if(!context) throw new Error("useOrder must be used within OrderProvider");
    return context;
}
export default function OrderProvider({ children }: { children: React.ReactNode }) {
    const [orderId, setOrderId] = useState<number>(0);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [orderStatus, setOrderStatus] = useState<'pending' | 'completed' | 'cancelled'>('pending');

    const createOrder = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/new-order');
            setOrderId(res.data.orderId);
            setOrderStatus('pending');
            setOrderItems([]);
            return res.data;
        } catch(err) {
            console.error("Error creating order:", err);
            return null;
        }
    }

    const addItemToOrder = async (item: OrderItem) => {
        setOrderItems((prevItems) => [...prevItems, item]);
        try {
            await axios.post("http://localhost:3000/api/add-modified-menu-item", {
                orderId: orderId,
                menuItemId: item.id,
                sugar: item.sugar,
                ice: item.ice,
                size: item.size,
                shots: item.extraShots,
                notes: item.notes
            });
        } catch(err) {
            console.error("Error adding item to order:", err);
            alert("Failed to add item to order.");
        }
    }
    const deleteItemFromOrder = (itemId: number) => {
        setOrderItems((prevItems) => prevItems.filter(item => item.id !== itemId));
        console.log("API call to delete from menu item-order table");
    }

    const completeOrder = async () => {
        // update transactions table
        console.log("API call to update transactions table");
        setOrderStatus('completed');
    }

    const cancelOrder = async () => {
        console.log("Order cancelled!");
        setOrderStatus('cancelled');
        setOrderItems([]);
    }

    const value = {
        orderId,
        orderStatus,
        orderItems,
        createOrder,
        completeOrder,
        cancelOrder,
        addItemToOrder,
        deleteItemFromOrder
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
}