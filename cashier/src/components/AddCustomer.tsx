import { useState } from "react";
import { Button, TextField } from '@mui/material';
import axios from "axios";

export function AddCustomer({ orderID}: {orderID: number}) {
    const [customerPhone, setCustomerPhone] = useState<string>("");
    const [customerName, setCustomerName] = useState<string>("");

    const handleNameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCustomerName(event.target.value);
    }
    const handlePhoneChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCustomerPhone(event.target.value);
    }

    async function SaveCustomer() {
        try {
            { /* CHANGE THIS TO MATCH BACKEND */ }
            await axios.post('../../../backend-cashier/routes/addCustomer', {
                name: customerName
            });
            alert("Customer added successfully!");
        } catch (error) {
            console.error("Error adding customer:", error);
            alert("Failed to add customer.");
        }
    }

    async function LinkCustomerToOrder() {
        try {
            { /* CHANGE THIS TO MATCH BACKEND */ }
            await axios.post('../../../backend-cashier/routes/linkCustomerToOrder', {
                orderId: orderID,
                phone: customerPhone
            });
            alert("Customer linked to order successfully!");
        } catch (error) {
            console.error("Error linking customer to order:", error);
            alert("Failed to link customer to order.");
        }
    }

    return (
        <div>
            <h2>Add Customer</h2>
            <TextField
                label="Customer Phone"
                value={customerPhone}
                onChange={handlePhoneChange}
            />
            <TextField
                label="Customer Name"
                value={customerName}
                onChange={handleNameChange}
            />
            <Button variant="contained" onClick={SaveCustomer}>
                Save Info
            </Button>
            <Button variant="contained" onClick={LinkCustomerToOrder}>
                Add
            </Button>
        </div>
    );
}