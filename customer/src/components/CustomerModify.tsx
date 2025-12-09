import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { FoodItem } from "../types";
import { useTranslation } from "react-i18next";
import { useTTS } from "../useTTS";   // ⭐ TTS import

interface Props {
  open: boolean;
  item: FoodItem;
  onClose: () => void;
  onAddToCart: (item: FoodItem) => void;
}

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

export default function CustomerModify({ open, item, onClose, onAddToCart }: Props) {
  const { t } = useTranslation();
  const { speak } = useTTS();   // ⭐ TTS Hook

  const [ice, setIce] = useState("100%");
  const [sugar, setSugar] = useState("100%");
  const [size, setSize] = useState("Medium");
  const [shots, setShots] = useState("0");
  const [notes, setNotes] = useState("");

  const [drinkTemp, setDrinkTemp] = useState<"Iced" | "Hot">("Iced");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // ⭐ Speak when opened
  useEffect(() => {
    if (open) {
      speak(`Customizing ${item.name}.`);
      setIce("100%");
      setSugar("100%");
      setSize("Medium");
      setShots("0");
      setNotes("");
      setDrinkTemp("Iced");
      setSelectedToppings([]);
      setQuantity(1);
    }
  }, [open]);

  // ⭐ Toggle toppings with speech
  const toggleTopping = (t: string) => {
    if (selectedToppings.includes(t)) {
      setSelectedToppings(selectedToppings.filter(x => x !== t));
      speak(`${t} removed.`);
    } else {
      setSelectedToppings([...selectedToppings, t]);
      speak(`${t} added.`);
    }
  };

  const handleAdd = () => {
    const computedIce = drinkTemp === "Hot" ? "0%" : ice;

    let fullNotes = `Temp: ${drinkTemp}`;
    if (selectedToppings.length > 0) {
      fullNotes += ` | Toppings: ${selectedToppings.join(", ")}`;
    }
    if (notes.trim() !== "") {
      fullNotes += ` | Notes: ${notes}`;
    }

    for (let i = 0; i < quantity; i++) {
      const modifiedItem: FoodItem = {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        customizations: {
          ice: computedIce,
          sugar,
          size,
          shots,
          notes: fullNotes,
        },
      };

      onAddToCart(modifiedItem);
    }

    speak(`${quantity} ${item.name} added to order.`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("modify.title")}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>

          {/* Temperature */}
          <TextField
            select
            label="Temperature"
            value={drinkTemp}
            
            onChange={(e) => {
              const value = e.target.value as "Iced" | "Hot";
              setDrinkTemp(value);
              speak(`${value} selected.`);
            }}
          >
            <MenuItem value="Iced">Iced</MenuItem>
            <MenuItem value="Hot">Hot</MenuItem>
          </TextField>

          {/* Ice */}
          <TextField
            select
            label={t("modify.ice")}
            value={ice}
            disabled={drinkTemp === "Hot"}
            
            onChange={(e) => {
              setIce(e.target.value);
              speak(`Ice level set to ${e.target.value}`);
            }}
          >
            <MenuItem value="0%">0%</MenuItem>
            <MenuItem value="25%">25%</MenuItem>
            <MenuItem value="50%">50%</MenuItem>
            <MenuItem value="100%">100%</MenuItem>
            <MenuItem value="150%">150%</MenuItem>
            <MenuItem value="200%">200%</MenuItem>
          </TextField>

          {/* Sugar */}
          <TextField
            select
            label={t("modify.sugar")}
            value={sugar}
            onChange={(e) => {
              setSugar(e.target.value);
              speak(`Sugar level set to ${e.target.value}`);
            }}
          >
            <MenuItem value="0%">0%</MenuItem>
            <MenuItem value="25%">25%</MenuItem>
            <MenuItem value="50%">50%</MenuItem>
            <MenuItem value="100%">100%</MenuItem>
            <MenuItem value="150%">150%</MenuItem>
          </TextField>

          {/* Size */}
          <TextField
            select
            label={t("modify.size")}
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
              speak(`${e.target.value} size selected.`);
            }}
          >
            <MenuItem value="Small">{t("modify.small")}</MenuItem>
            <MenuItem value="Medium">{t("modify.medium")}</MenuItem>
            <MenuItem value="Large">{t("modify.large")}</MenuItem>
          </TextField>

          {/* Shots */}
          <TextField
            select
            label={t("modify.shots")}
            value={shots}
            onChange={(e) => {
              setShots(e.target.value);
              speak(`${e.target.value} shots selected.`);
            }}
          >
            <MenuItem value="0">{t("modify.none")}</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
          </TextField>

          {/* Toppings */}
          <div style={{ marginTop: "10px" }}>
            <h3>Toppings</h3>
            {TOPPINGS.map((t) => (
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

          {/* Notes */}
          <TextField
            label={t("modify.notes")}
            multiline
            rows={2}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
          />

          {/* Quantity */}
          <TextField
            select
            label="Quantity"
            value={quantity}
            onChange={(e) => {
              const num = parseInt(e.target.value);
              setQuantity(num);
              speak(`Quantity set to ${num}`);
            }}
          >
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <MenuItem key={n} value={n}>{n}</MenuItem>
            ))}
          </TextField>

          {/* Add to Order Button */}
          <Button variant="contained" color="primary" onClick={handleAdd}>
            {t('modify.addToOrder')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
