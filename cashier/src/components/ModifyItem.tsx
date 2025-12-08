import { useState } from "react";
import { Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import axios from "axios";
import { useOrder } from "../OrderContext";
import type { OrderItem } from "../OrderContext";
import './ModifyItem.css';

const TOPPINGS = [
    "Regular Pearl",
    "Lychee Jelly",
    "Pudding",
    "Ice Cream",
    "Mini Pearls",
    "Aiyu Jelly",
    "Creama",
    "Sub Creama",
    "Crystal Boba",
    "Mango Popping Boba",
    "Strawberry Popping Boba",
    "Coffee Jelly",
    "Honey Jelly",
    "Peach Popping Boba",
    "Fresh Milk",
    "Matcha Creama",
];

export function ModifyItem({ modifyID, item }: { modifyID: number, item: OrderItem | null }) {
    const { addItemToOrder } = useOrder();
    const [percentIce, setPercentIce] = useState<1.0 | 0.0 | 0.25 | 0.5 | 1.50 | 2.0>(1.0);
    const [percentSugar, setPercentSugar] = useState<1.0 | 0.0 | 0.25 | 0.5 | 1.50 | 2.0>(1.0);
    const [size, setSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
    const [extraShots, setExtraShots] = useState<number>(0);
    const [notes, setNotes] = useState<string>("");
    const [drinkTemp, setDrinkTemp] = useState<'Iced' | 'Hot'>('Iced');
    const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
    const [quantity, setQuantity] = useState<number>(1);

    const toggleTopping = (t: string) => {
        if (selectedToppings.includes(t)) {
            setSelectedToppings(selectedToppings.filter(x => x !== t));
        } else {
            setSelectedToppings([...selectedToppings, t]);
        }
    };

    const writeNotes = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setNotes(event.target.value);
    }

    async function SaveItem() {
        try {
            if (item) {
                let computedIce = drinkTemp === "Hot" ? "0%" : String(percentIce * 100) + "%";

                item.ice = computedIce;
                item.sugar = String(percentSugar * 100) + "%";
                item.extraShots = String(extraShots);
                item.size = size;

                let fullNotes = `Temp: ${drinkTemp}`;
                if (selectedToppings.length > 0) {
                    fullNotes += ` | Toppings: ${selectedToppings.join(", ")}`;
                }
                if (notes.trim() !== "") {
                    fullNotes += ` | Notes: ${notes}`;
                }

                item.notes = fullNotes;

                for (let i = 0; i < quantity; i++) {
                    await addItemToOrder({ ...item });
                }
            }
        } catch (error) {
            alert("Could not save item.");
            console.error("Error saving modified item:", error);
        }
    }

    return (
        <div className='modify-page'>
            <h2>Modify Item</h2>
            <label>Temperature:</label>
            <select
                value={drinkTemp}
                onChange={(e) => setDrinkTemp(e.target.value as 'Iced' | 'Hot')}
            >
                <option value="Iced">Iced</option>
                <option value="Hot">Hot</option>
            </select>
            <label htmlFor="ice-select">Select Ice Level:</label>
            <select
                id="ice-select"
                value={percentIce}
                disabled={drinkTemp === "Hot"}
                onChange={(e) => setPercentIce(parseFloat(e.target.value) as any)}
            >
                <option value={1.0}>100% Ice</option>
                <option value={0.75}>75% Ice</option>
                <option value={0.5}>50% Ice</option>
                <option value={0.25}>25% Ice</option>
                <option value={0.0}>No Ice</option>
                <option value={2.0}>Extra Ice</option>
            </select>
            <label htmlFor="sugar-select">Select Sugar Level:</label>
            <select
                id="sugar-select"
                value={percentSugar}
                onChange={(e) => setPercentSugar(parseFloat(e.target.value) as any)}
            >
                <option value={1.0}>100% Sugar</option>
                <option value={0.75}>75% Sugar</option>
                <option value={0.5}>50% Sugar</option>
                <option value={0.25}>25% Sugar</option>
                <option value={0.0}>No Sugar</option>
                <option value={2.0}>Extra Sugar</option>
            </select>
            <label htmlFor="size-select">Select Size:</label>
            <select
                id="size-select"
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
            >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
            </select>
            <label htmlFor="extra-shots">Number of Extra Shots:</label>
            <select
                id="extra-shots"
                value={extraShots}
                onChange={(e) => setExtraShots(parseInt(e.target.value))}
            >
                {[0,1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n}</option>
                ))}
            </select>
            <div className="toppings-section">
                <h3>Toppings</h3>
                {TOPPINGS.map(t => (
                    <FormControlLabel
                        key={t}
                        control={
                            <Checkbox
                                checked={selectedToppings.includes(t)}
                                onChange={() => toggleTopping(t)}
                            />
                        }
                        label={t}
                    />
                ))}
            </div>
            <div className='notes'>
                <TextField 
                    label="Extra Notes" 
                    multiline 
                    rows={4} 
                    value={notes} 
                    onChange={writeNotes} 
                    variant="outlined" 
                    fullWidth 
                />
            </div>
            <label>Quantity:</label>
            <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
            >
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>{n}</option>
                ))}
            </select>
            <Button variant='contained' onClick={SaveItem}>Save Item</Button>
        </div>
        
    );
}