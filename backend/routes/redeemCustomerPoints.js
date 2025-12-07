const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// POST /api/customers/:id/redeem
router.post('/:id/redeem', async (req, res) => {
  const { id } = req.params;
  const { pointsToUse } = req.body;

  // validate input
  if (!pointsToUse || pointsToUse <= 0) {
    return res.status(400).json({ error: "Invalid pointsToUse value" });
  }

  try {
    const result = await pool.query(
      `UPDATE customers
       SET points = points - $1
       WHERE id = $2 AND points >= $1
       RETURNING points`,
      [pointsToUse, id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Not enough points to redeem" });
    }

    res.json({
      message: "Points redeemed successfully",
      newPointBalance: result.rows[0].points
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Redemption failed due to server error" });
  }
});

module.exports = router;
