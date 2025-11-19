import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

export function ManagerOverview() {

    const tempBarData = [
        { name: "Item A", value: 30 },
        { name: "Item B", value: 45 },
        { name: "Item C", value: 20 },
    ];

    const tempLineData = [
        { name: "10 AM", value: 5 },
        { name: "11 AM", value: 12 },
        { name: "12 PM", value: 18 },
    ];

    const lowStockDummy = [
        { item: "Milk Tea", stock: 4 },
        { item: "Brown Sugar", stock: 2 },
        { item: "Tapioca Pearls", stock: 6 },
    ];

    return (
        <div className="overview-container w-full p-6 flex gap-10" style={{ color: 'black' }}>

            {/* LEFT SIDE (graphs) */}
            <div className="flex-2 flex flex-col gap-10">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">
                        Orders Per Item (Today)
                    </h2>
                    <BarChart width={450} height={300} data={tempBarData}>
                        <XAxis dataKey="name" stroke="#000" />
                        <YAxis stroke="#000" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4798F5" />
                    </BarChart>
                </div>

                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">
                        Hourly Sales
                    </h2>
                    <LineChart width={450} height={300} data={tempLineData}>
                        <XAxis dataKey="name" stroke="#000" />
                        <YAxis stroke="#000" />
                        <Tooltip />
                        <Line dataKey="value" stroke="#4798F5" strokeWidth={3} />
                    </LineChart>
                </div>
            </div>

            {/* RIGHT SIDE (table) */}
            <div className="flex-1">
                <h2 className="text-xl font-semibold mb-3 text-center">
                    Lowest Stock Items
                </h2>

                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2 text-left">Item</th>
                            <th className="border px-4 py-2 text-left">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStockDummy.map((row, index) => (
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