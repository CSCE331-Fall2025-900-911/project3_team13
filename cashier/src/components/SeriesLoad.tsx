import {dummySeries} from '../data/dummySeries';
import { useState, useEffect } from "react";
import Dialogue from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import { ModifyItem }  from './ModifyItem';
import type { OrderItem } from '../OrderContext';
import axios from 'axios';

interface MenuItem {
    itemId: number;
    name: string;
    iconUrl: string;
}

interface MenuItemResponse {
    id: number,
    name: string,
    category: string,
    price: number,
    modifications: string
}

interface SeriesData {
    menuItems: {
        itemId: number;
        name: string;
        iconUrl: string;
    }
}

export function SeriesLoad({ seriesName }: { seriesName: string }) {
    const [SeriesData, setSeriesData] = useState<MenuItem[] | null>(null);
    const [orderItemData, setOrderItemData] = useState<Record<number, OrderItem> | null>();
    const [isLoading, setIsLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [modID, setModID] = useState(0);
    const [item, setItem] = useState<OrderItem | null>(null);

    async function OpenModifications({ itemId } : { itemId: number }) {
        try {
            setModID(itemId);

            if(orderItemData) {
                setItem(orderItemData[itemId]);
                setOpenDialog(true);
            }
        } catch (error) {
            console.error("Error opening modifications:", error);
        }
    }

    /*
    async function fetchSeriesData(): Promise<MenuItem[]> {
        { For testing only, REMOVE FOR DEPLOYMENT }
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

        {  Actual fetch code for deployment }
        // this is where the fetch code will go
        Order
    } */

    const fetchItemData = async () => {
        console.log(seriesName);
        const res = await axios.get(encodeURI(`http://localhost:3000/api/get-menu-items?category=${seriesName}`));
        setOrderItemData(
            Object.fromEntries(
                res.data.drinks.map((drink: MenuItemResponse) => [
                    drink.id, 
                    {
                        id: drink.id,
                        name: drink.name,
                        price: parseFloat(drink.price),
                        ice: '100%',
                        sugar: '100%',
                        size: 'Medium',
                        extraShots: '0',
                        notes: ""
                    }
                ])
            )
        );
        setSeriesData(res.data.drinks.map((drink: MenuItemResponse) => ({
            itemId: drink.id,
            name: drink.name,
            iconUrl: '../assets/react.svg'
        })));
    }
    
    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                await fetchItemData();
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
                <IconButton key={item.itemId} onClick={() => OpenModifications({ itemId: item.itemId })}>
                    <div className='series-item-card'>
                        <img src={item.iconUrl} alt={item.name} />
                        <h4>{item.name}</h4>
                    </div>
                </IconButton>
            ))}
            <Dialogue open={openDialog} onClose={() => setOpenDialog(false)}>
                <ModifyItem modifyID={modID} item={item} />
            </Dialogue>
        </div>
    );
    
}
