import { useState } from "react";
import { Button, TextField } from '@mui/material';
import axios from "axios";

export function ModifyItem({modifyID}: {modifyID: number}) {
    const [percentIce, setPercentIce] = useState<1.0 | 0.0 | 0.25 | 0.5 | 1.50 | 2.0>(1.0);
    const [percentSugar, setPercentSugar] = useState<1.0 | 0.0 | 0.25 | 0.5 | 1.50 | 2.0>(1.0);
    const [size, setSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
    const [extraShots, setExtraShots] = useState<number>(0);
    const [notes, setNotes] = useState<string>("");

    const writeNotes = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setNotes(event.target.value);
    }


    async function SaveItem() {
        try {
            { /* CHANGE THIS TO MATCH BACKEND */ }
            await axios.post('http://localhost:3000/api/add-modified-menu-item', {
                itemId: 1,
                ice: percentIce,
                sugar: percentSugar,
                size: size,
                extraShots: extraShots,
                notes: notes
            });
            alert("Item saved successfully!");
        } catch (error) {
            console.error("Error saving modified item:", error);
            alert("Failed to save item.");
        }
    }

    return (
        <div>
            <h2>Modify Item</h2>
            <label htmlFor="ice-select">Select Ice Level:</label>
            <select
                id="ice-select"
                value={percentIce}
                onChange={(e) => setPercentIce(parseFloat(e.target.value) as 1.0 | 0.0 | 0.25 | 0.5 | 1.50 | 2.0)}
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
                onChange={(e) => setPercentSugar(parseFloat(e.target.value) as 1.0 | 0.0 | 0.25 | 0.5 | 1.50 | 2.0)}
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
                onChange={(e) => setSize(e.target.value as 'Small' | 'Medium' | 'Large')}
            >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
            </select>
            <label htmlFor="extra-shots">Number of Extra Shots:</label>
            <select
                id="extra-shots"
                value={extraShots}
                onChange={(e) => setExtraShots(parseInt(e.target.value) as number)}
            >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            </select>
            <TextField label="Extra Notes" multiline rows={4} value={notes} onChange={writeNotes} variant="outlined" fullWidth />
            <p>Notes written: {notes}</p>
            <Button onClick={() => SaveItem()}>Save Item</Button>
        </div>
        
    );
}