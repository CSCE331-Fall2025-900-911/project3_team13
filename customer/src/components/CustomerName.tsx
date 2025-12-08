import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import "./Customer.css";

export default function CustomerName() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const phone = localStorage.getItem("phoneNumber");

    if (!phone || name.trim() === "") return;

    try {
      // STEP 1: Create customer
      const res = await axios.post("http://localhost:3000/api/add-customer", {
        customerName: name,
        customerPhone: phone
      });

      const customerId = res.data.customerId;
      localStorage.setItem("customerName", name);
      localStorage.setItem("customerId", customerId);

      // STEP 2: Create order
      const newOrder = await axios.post("http://localhost:3000/api/new-order");
      const orderId = newOrder.data.orderId;
      localStorage.setItem("orderId", orderId.toString());

      // STEP 3: Link
      await axios.post("http://localhost:3000/api/link-customer-to-order", {
        orderId,
        customerId,
        employeeId: 1
      });

      navigate("/menu");

    } catch (err) {
      console.error(err);
      alert("Error creating customer");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Enter Name</h1>

        <TextField
          label="Your Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button
          className="go-button"
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
