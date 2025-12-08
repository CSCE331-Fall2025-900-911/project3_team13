const express = require("express");
const router = express.Router();

let activeRequests = [];

router.post("/request", (req, res) => {
    const { kiosk } = req.body;

    activeRequests.push({
        kiosk: kiosk || "Unknown",
        time: Date.now()
    });

    res.json({ success: true });
});

router.get("/active", (req, res) => {
    res.json(activeRequests);
});

router.delete("/clear", (req, res) => {
    activeRequests = [];
    res.json({ success: true });
});

module.exports = router;
