import {dummySeries} from '../../../../../project3/cashier/src/data/dummySeries';
import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';



interface MenuItem {
    itemId: number;
    name: string;
    iconUrl: string;
}

export function SeriesLoad() {
    const [SeriesData, setSeriesData] = useState<MenuItem[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchSeriesData(): Promise<MenuItem[]> {
        { /* For testing only, REMOVE FOR DEPLOYMENT */ }
        return new Promise((resolve) => {
            setTimeout(() => {
                const items = dummySeries.map(item => ({
                    itemId: item.id,
                    name: item.name,
                    iconUrl: item.icon
                }));
                resolve(items);
            }, 1000); // Simulate network delay
        });

        { /* Actual fetch code for deployment */ }
        // this is where the fetch code will go
    }

    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                const data = await fetchSeriesData();
                setSeriesData(data); 
            } catch (error) {
                console.error("Error fetching series data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [])

    if (isLoading) {
        return <div>Loading series page...</div>;
    }

    if (!SeriesData || SeriesData.length == 0) {
        return <div>No series data available.</div>;
    }

    return (
        <div>
            {SeriesData.map((item) => (
                <IconButton key={item.itemId} >
                    <div className='series-item-card'>
                        <img src={item.iconUrl} alt={item.name} />
                        <h4>{item.name}</h4>
                    </div>
                </IconButton>
            ))}
        </div>
    );
    
}
