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

type OrderStatus = 'pending' | 'completed' | 'canceled' | 'in progress' | 'ready to pay';

// Our context primarily consists of the order, its items, its status, 
// and any methods that can act on it.
export const OrderContext = createContext<{
    orderId: number;
    orderStatus: OrderStatus;
    orderItems: OrderItem[];
    createOrder: () => Promise<number | null>;
    completeOrder: () => Promise<void>;
    loadOrder: (orderId: number) => Promise<void>;
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
    const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');

    // Creates a new order. Intended to happen on first render, when an order is cancelled, or when a  order is completed.
    // Known issue: Refreshing causes this to be called
    const createOrder = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/new-order');
            setOrderId(res.data.orderId);
            setOrderStatus('pending');
            setOrderItems([]);
            return res.data;
        } catch(err) {
            alert("There was an issue starting the order.");
            console.error("Error creating order:", err);
            return null;
        }
    }

    // Adds item to the order.
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
            
            const newItem: OrderItem = {
                ...item,
                comboId: res.data.comboId
            };
            console.log(newItem.comboId);
            setOrderItems((prevItems) => [...prevItems, newItem]);
        } catch(err) {
            alert("Could not add item to order.");
            console.error("Error adding item to order:", err);
        }
    }

    // Deletes item from order. It takes in the combo ID so that the right instance of the
    // right menu item can be deleted.
    const deleteItemFromOrder = async (comboId: number) => {
        try {
            const res = await axios.delete(`http://localhost:3000/api/delete-menu-item/item/${comboId}`);
            setOrderItems((prevItems) => prevItems.filter(item => item.comboId !== comboId));
        } catch(error) {
            alert("Could not delete item from order.");
            console.error("Error deleting item:", error);
        }
        
    }

    // Checkout process
    const completeOrder = async () => {
        // update transactions table
        const total = orderItems.reduce((sum: number, item: OrderItem) => sum + item.price, 0);
        try {
            await axios.patch("http://localhost:3000/api/checkout", {
                orderId: orderId,
                total: total,
                status: 'in progress'
            });
            setOrderStatus('in progress');
            alert("Checkout successful!");
        } catch(error) {
            alert("Checkout failed.");
            console.error(error);
        }
        
    }

    // Loads order by ID
    const loadOrder = async (orderId: number) => {
        try {
            const res = await axios.get(encodeURI(`http://localhost:3000/api/load-order?id=${orderId}`));
            setOrderId(orderId);
            setOrderStatus(res.data.status);
            const mappedItems = res.data.items.map((item: any) => ({
                comboId: item.comboid,
                itemId: item.menuitemid,
                name: item.name,
                price: item.price,
                ice: item.ice,
                sugar: item.sugar,
                size: item.size,
                extraShots: item.shots,
                notes: item.notes
            }));
            setOrderItems(mappedItems);
            console.log("Order loaded:", res.data);
        } catch(error) {
            alert("Could not load order.");
            console.error("Error loading order:", error);
        }
    }

    // Cancels the current order and starts over
    const cancelOrder = async () => {
        try {
            for(const item of orderItems) {
                await deleteItemFromOrder(item.comboId);
            }
            setOrderStatus('canceled');
            setOrderItems([]);
        } catch (error) {
            alert("Could not cancel order.");
            console.error("Error trying to cancel order:", error);
        }
    }

    // Below are the attributes we will use for our order context.
    const value = {
        orderId,
        orderStatus,
        orderItems,
        createOrder,
        completeOrder,
        loadOrder,
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