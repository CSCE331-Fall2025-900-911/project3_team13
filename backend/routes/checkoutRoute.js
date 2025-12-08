const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.patch('/', async (req, res) => {
  const { orderId, total, status, freeComboIds } = req.body;

  // Always normalize
  const freeList = Array.isArray(freeComboIds) ? freeComboIds : [];

  let client;
  try {
    client = await pool.connect();

    // --------------------------------------------------
    // 1) Fetch transaction → get customerId
    // --------------------------------------------------
    const txRes = await client.query(
      `SELECT customerid 
       FROM transactions 
       WHERE id = $1`,
      [orderId]
    );

    if (txRes.rows.length === 0) {
      client.release();
      return res.status(404).json({
        message: "Transaction for order not found--likely no customer was linked to the order."
      });
    }

    const customerId = txRes.rows[0].customerid;
    let points = 0;
    let free_drinks = 0;
    let redeemedIds = [];

    // --------------------------------------------------
    // 2) Fetch loyalty info (non-guest)
    // --------------------------------------------------
    if (customerId !== 1) {
      const customerInfo = await client.query(
        `SELECT points, free_drinks 
         FROM customers 
         WHERE id = $1`,
        [customerId]
      );

      if (customerInfo.rows.length === 0) {
        client.release();
        return res.status(404).json({ message: "Customer not found." });
      }

      points = Number(customerInfo.rows[0].points);
      free_drinks = Number(customerInfo.rows[0].free_drinks);

      // --------------------------------------------------
      // 3) Redeem free drinks — set price_override = 0
      // --------------------------------------------------
      if (freeList.length > 0 && free_drinks > 0) {

        // limit to what customer has
        const maxRedeemable = Math.min(free_drinks, freeList.length);
        const redeeming = freeList.slice(0, maxRedeemable);

        // Apply overrides
        const redeemRes = await client.query(
          `UPDATE menu_item_order
             SET price_override = 0
           WHERE orderid = $1
             AND id = ANY($2::int[])
           RETURNING id`,
          [orderId, redeeming]
        );

        redeemedIds = redeemRes.rows.map(r => r.id);

        // reduce customer free drink inventory
        free_drinks = Math.max(0, free_drinks - redeemedIds.length);
      }
    }

    // --------------------------------------------------
    // 4) Recalculate order total inside DB
    // --------------------------------------------------
    const totalsRes = await client.query(
      `SELECT 
          COALESCE(SUM(
            CASE 
              WHEN m.price_override IS NOT NULL THEN m.price_override
              ELSE mi.price
            END
          ), 0) AS new_total,
          COUNT(*) FILTER (
            WHERE m.price_override IS NULL 
               OR m.price_override > 0
          ) AS paid_drinks
       FROM menu_item_order m
       JOIN menu_items mi ON mi.id = m.menuitemid
       WHERE m.orderid = $1`,
      [orderId]
    );

    const newTotal = Number(totalsRes.rows[0].new_total);
    const paidDrinks = Number(totalsRes.rows[0].paid_drinks);

    // --------------------------------------------------
    // 5) Update transaction total
    // --------------------------------------------------
    await client.query(
      `UPDATE transactions 
         SET total = $1
       WHERE id = $2`,
      [newTotal, orderId]
    );

    // --------------------------------------------------
    // 6) Loyalty — earn stamps + free drinks (non-guest)
    // --------------------------------------------------
    if (customerId !== 1) {
      points += paidDrinks; // only pay drinks earn points

      const earned = Math.floor(points / 10);
      free_drinks += earned;

      points = points % 10;

      await client.query(
        `UPDATE customers
           SET points = $1,
               free_drinks = $2
         WHERE id = $3`,
        [points, free_drinks, customerId]
      );
      console.log(
        `LOYALTY: customer ${customerId}, paidDrinks=${paidDrinks}, earned=${earned}, remaining points=${points}, free_drinks=${free_drinks}`
      );
    }
    
    // --------------------------------------------------
    // 7) Update order status
    // --------------------------------------------------
    const orderRes = await client.query(
      `UPDATE orders
         SET status = $1
       WHERE id = $2
       RETURNING timestamp`,
      [status, orderId]
    );

    client.release();

    // --------------------------------------------------
    // 8) Respond
    // --------------------------------------------------
    return res.status(200).json({
      message: "Checkout successful",
      orderInfo: {
        orderId,
        originalSubmittedTotal: total,
        finalTotal: newTotal,
        redeemedComboIds: redeemedIds,
        timestamp: orderRes.rows[0].timestamp
      }
    });

  } catch (err) {
    if (client) client.release();
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
