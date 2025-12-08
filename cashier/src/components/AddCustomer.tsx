import { useState } from "react";
import { Button, TextField } from '@mui/material';
import axios from "axios";

export function AddCustomer({ orderID}: {orderID: number}) {
    const [customerPhone, setCustomerPhone] = useState<string>("");
    const [customerName, setCustomerName] = useState<string>("");
    const [customerId, setCustomerId] = useState<number>(-1);

    const handleNameChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCustomerName(event.target.value);
    }
    const handlePhoneChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCustomerPhone(event.target.value);
    }

    async function SaveCustomer() {
        try {
            const res = await axios.post('http://localhost:3000/api/add-customer', {
                customerName: customerName,
                customerPhone: customerPhone
            });
            setCustomerId(res.data.customerId);
        } catch (error) {
            console.error("Error adding customer:", error);
        }
    }

    async function LinkCustomerToOrder() {
        try {
            await axios.post('http://localhost:3000/api/link-customer-to-order', {
                orderId: orderID,
                customerId: customerId,
                employeeId: 2
            });
        } catch (error) {
            console.error("Error linking customer to order:", error);
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