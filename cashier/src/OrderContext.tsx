import axios from 'axios';
import { createContext, useContext, useState } from 'react';

/**
 * This creates our OrderContext, which enables persistence of order-related attributes across
 * the components of the cashier view. This will likely also be applied to the customer view.
 * The context also contains support for order-related API calls (create/cancel order, add/delete item)
 */

// large OrderItem object, supports all order/item-related queries
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

// Our context primarily consists of the order, its items, its status, 
// and any methods that can act on it.
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

// The OrderProvider surrounds the app so that the context can be provided, giving "global" access to order properties
export default function OrderProvider({ children }: { children: React.ReactNode }) {
    const [orderId, setOrderId] = useState<number>(0);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [orderStatus, setOrderStatus] = useState<'pending' | 'completed' | 'cancelled'>('pending');

    // Creates a new order. Intended to happen on first render, when an order is cancelled, or when a  order is completed.
    // Known issue: Refreshing causes this to be called
    const createOrder = async () => {
        try {
            const res = await axios.post('https://project3-team13-backend.onrender.com/api/new-order');
            setOrderId(res.data.orderId);
            setOrderStatus('pending');
            setOrderItems([]);
            return res.data;
        } catch(err) {
            console.error("Error creating order:", err);
            return null;
        }
    }

    // Adds item to the order.
    const addItemToOrder = async (item: OrderItem) => {
        try {
            const res = await axios.post("http://project3-team13-backend.onrender.com/api/add-modified-menu-item", {
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

    // Deletes item from order. It takes in the combo ID so that the right instance of the
    // right menu item can be deleted.
    const deleteItemFromOrder = async (comboId: number) => {
        try {
            const res = await axios.delete(`http://project3-team13-backend.onrender.com/api/delete-menu-item/item/${comboId}`);
            setOrderItems((prevItems) => prevItems.filter(item => item.comboId !== comboId));
            alert("Item deleted successfully!");
        } catch(error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item.");
        }
        
    }

    // To be implemented in the future; checkout process
    const completeOrder = async () => {
        // update transactions table
        console.log("API call to update transactions table");
        setOrderStatus('completed');
    }

    // Cancels the current order and starts over
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

    // Below are the attributes we will use for our order context.
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