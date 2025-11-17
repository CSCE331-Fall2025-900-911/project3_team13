import axios from 'axios';
import { useState, useEffect } from 'react'
import Dialogue from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import type { OrderItem } from '../OrderContext';
import { ModifyItem } from './ModifyItem';

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

export function Library() {
    const [searchItems, setSearchItems] = useState<MenuItem[]>([]);
    const [results, setResults] = useState<MenuItem[]>([]);
    const [query, setQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modID, setModID] = useState(0);
    const [item, setItem] = useState<OrderItem | null>(null);
    const [orderItemData, setOrderItemData] = useState<Record<number, OrderItem> | null>();
    const [openDialog, setOpenDialog] = useState(false);

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

    const handleQuery = (query: string) => {
        setQuery(query);
        if(query === "") {
            setResults(searchItems);
        } else {
            let res: MenuItem[] = [];
            for(let item of searchItems) {
                if(item.name.toLowerCase().includes(query.toLowerCase())) {
                    res.push(item);
                }
            }
            setResults(res);
        }
    }

    useEffect(() => {
        // self-invoking function to get all menu items
        (async () => {
            try {
                setIsLoading(true);
                const res = await axios.get("http://localhost:3000/api/get-all-items");
                setOrderItemData(
                    Object.fromEntries(
                        res.data.items.map((item: MenuItemResponse) => [
                            item.id, 
                            {
                                comboId: 0,
                                itemId: item.id,
                                name: item.name,
                                price: parseFloat(String(item.price)),
                                ice: '100%',
                                sugar: '100%',
                                size: 'Medium',
                                extraShots: '0',
                                notes: ""
                            }
                        ])
                    )
                );
                
                const mappedItems = res.data.items.map((item: MenuItemResponse) => ({
                    itemId: item.id,
                    name: item.name,
                    iconUrl: '../assets/react.svg'
                }));

                setSearchItems(mappedItems);
                setResults(mappedItems);
            } catch(error) {
                console.error("Error fetching items:", error);
            } finally {
                setIsLoading(false);
            }
        })()
    }, [])
    
    if (isLoading) {
        return <div>Loading series page...</div>;
    }

    return (
        <div>
            <h1>Library</h1>
            <div>
                <input type="text"
                    placeholder="Search items..."
                    value={query}
                    onChange={(e) => handleQuery(e.target.value)}
                />
            </div>
            {results.map((item) => (
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