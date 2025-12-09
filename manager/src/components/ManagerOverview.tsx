import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import './ManagerOverview.css';

interface LowStockItem {
    item: string;
    stock: number;
}

interface LowStockItemResponse {
    name: string;
    quantity: number;
}

interface OrdersPerItemResponse {
    name: string;
    value: number;
}

interface HourlySalesResponse {
    name: string;
    value: number;
}

export function ManagerOverview() {

    const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
    const [ordersPerItem, setOrdersPerItem] = useState<OrdersPerItemResponse[]>([]);
    const [hourlySales, setHourlySales] = useState<HourlySalesResponse[]>([]);

    const getLowQuantity = async () => {
        try {
            const lowStockRes = await axios.get<{ lowQuantityItems: LowStockItemResponse[] }>(
                "https://project3-team13-backend.onrender.com/api/inventory/get-low-quantity"
            );

            const items = lowStockRes.data.lowQuantityItems.map(item => ({
                item: item.name,
                stock: item.quantity
            }));

            setLowStockItems(items);
        } catch (err) {
            console.error("Error fetching low stock:", err);
        }
    };

    const getOrdersPerItem = async () => {
        try {
            const menuRes = await axios.get<{ items: { name: string }[] }>(
                "http://localhost:3000/api/get-all-items"
            );
            const res = await axios.get<{ ordersPerItem: { item_name: string; count: number }[] }>(
                "https://project3-team13-backend.onrender.com/api/manager-analytics/orders-per-item-today"
            );
            const ordersMap: Record<string, number> = {};
            res.data.ordersPerItem.forEach(item => {
                ordersMap[item.item_name] = Number(item.count);
            });
            const mapped: OrdersPerItemResponse[] = menuRes.data.items.map(item => ({
                name: item.name,
                value: ordersMap[item.name] || 0,
            }));

            setOrdersPerItem(mapped);
        } catch (err) {
            console.error("Error fetching orders per item:", err);
        }
    };

    const getHourlySales = async () => {
        try {
            const res = await axios.get<{ hourlySales: HourlySalesResponse[] }>(
                "https://project3-team13-backend.onrender.com/api/manager-analytics/hourly-sales-today"
            );
            setHourlySales(res.data.hourlySales);
        } catch (err) {
            console.error("Error fetching hourly sales:", err);
        }
    };

    useEffect(() => {
        getLowQuantity();
        getOrdersPerItem();
        getHourlySales();

        // live update every 10 seconds
        const interval = setInterval(() => {
            getOrdersPerItem();
            getHourlySales();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="overview-container w-full p-6 flex gap-10" style={{ color: 'black' }}>

            {/* LEFT SIDE (graphs) */}
            <div className="flex-2 flex flex-col gap-10">

                {/* ORDERS PER ITEM */}
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">Orders Per Item (Today)</h2>

                    <BarChart width={400} height={200} data={ordersPerItem}>
                        <XAxis 
                            dataKey="name" 
                            stroke="#000" 
                            label={{ value: "Menu Item", position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                            stroke="#000" 
                            label={{ value: "Orders", angle: -90, position: 'insideLeft', offset: 10 }}
                        />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4798F5" />
                    </BarChart>
                </div>

                {/* HOURLY SALES */}
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">Hourly Sales (Today)</h2>

                    <LineChart width={400} height={200} data={hourlySales}>
                        <XAxis 
                            dataKey="name" 
                            stroke="#000" 
                            label={{ value: "Hour", position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                            stroke="#000" 
                            label={{ value: "Revenue ($)", angle: -90, position: 'insideLeft', offset: 10 }}
                        />
                        <Tooltip />
                        <Line dataKey="value" stroke="#4798F5" strokeWidth={3} />
                    </LineChart>
                </div>
            </div>

            {/* RIGHT SIDE (low stock list) */}
            <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3 text-center">Lowest Stock Items</h2>

                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2 text-left">Item</th>
                            <th className="border px-4 py-2 text-left">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStockItems.map((row, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50">
                                <td className="border px-4 py-2">{row.item}</td>
                                <td className="border px-4 py-2">{row.stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}