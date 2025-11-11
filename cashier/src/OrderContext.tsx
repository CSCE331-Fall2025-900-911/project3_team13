import axios from 'axios';
import { createContext, useContext, useState } from 'react';

export interface OrderItem {
    comboId: number,
    itemId: number;
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
        try {
            const res = await axios.post("http://localhost:3000/api/add-modified-menu-item", {
                orderId: orderId,
                menuItemId: item.itemId,
                sugar: item.sugar,
                ice: item.ice,
                size: item.size,
                shots: item.extraShots,
                notes: item.notes
            });
            item.comboId = res.data.comboId;
            console.log(item.comboId);
            setOrderItems((prevItems) => [...prevItems, item]);
        } catch(err) {
            console.error("Error adding item to order:", err);
            alert("Failed to add item to order.");
        }
    }

    const deleteItemFromOrder = async (comboId: number) => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/delete-menu-item/item/${comboId}`);
            setOrderItems((prevItems) => prevItems.filter(item => item.comboId !== comboId));
            alert("Item deleted successfully!");
        } catch(error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item.");
        }
        
    }

    const completeOrder = async () => {
        // update transactions table
        console.log("API call to update transactions table");
        setOrderStatus('completed');
    }

    const cancelOrder = async () => {
        try {
            for(const item of orderItems) {
                await deleteItemFromOrder(item.comboId);
            }
            setOrderStatus('cancelled');
            setOrderItems([]);
            alert("Order cancelled!");
        } catch (error) {
            console.error("Error trying to cancel order:", error);
            alert("Could not cancel order.");
        }
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