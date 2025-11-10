import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { FoodItem } from "../types";

interface Props {
  open: boolean;
  item: FoodItem;
  onClose: () => void;
  onAddToCart: (item: FoodItem) => void;
}

export default function CustomerModify({ open, item, onClose, onAddToCart }: Props) {
  const [ice, setIce] = useState("100%");
  const [sugar, setSugar] = useState("100%");
  const [shots, setShots] = useState("0");
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    const mods: string[] = [];
    if (ice !== "100%") mods.push(`Ice: ${ice}`);
    if (sugar !== "100%") mods.push(`Sugar: ${sugar}`);
    if (shots !== "0") mods.push(`Shots: ${shots}`);
    if (notes.trim()) mods.push(`Notes: ${notes}`);

    const modifiedItem: FoodItem = {
      id: Date.now(),
      name: item.name + (mods.length ? ` - ${mods.join(", ")}` : ""),
      description: item.description,
      series: item.series,
      price: item.price,
      customizations: {
        ice,
        sugar,
        shots,
        notes,
      },
    };
    onAddToCart(modifiedItem);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Customize Item</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
          <TextField select label="Ice" value={ice} onChange={(e) => setIce(e.target.value)}>
            <MenuItem value="0%">0%</MenuItem>
            <MenuItem value="25%">25%</MenuItem>
            <MenuItem value="50%">50%</MenuItem>
            <MenuItem value="75%">75%</MenuItem>
            <MenuItem value="100%">100%</MenuItem>
            <MenuItem value="Extra">Extra</MenuItem>
          </TextField>

          <TextField select label="Sugar" value={sugar} onChange={(e) => setSugar(e.target.value)}>
            <MenuItem value="0%">0%</MenuItem>
            <MenuItem value="25%">25%</MenuItem>
            <MenuItem value="50%">50%</MenuItem>
            <MenuItem value="75%">75%</MenuItem>
            <MenuItem value="100%">100%</MenuItem>
            <MenuItem value="Extra">Extra</MenuItem>
          </TextField>

          <TextField select label="Extra Shots" value={shots} onChange={(e) => setShots(e.target.value)}>
            <MenuItem value="0">None</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
          </TextField>

          <TextField
            label="Special Notes"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add to Order
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}