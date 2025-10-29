SELECT 
    EXTRACT(WEEK FROM timestamp) AS week_number,
    COUNT(*) AS number_orders
FROM orders
GROUP BY EXTRACT(WEEK FROM timestamp)
ORDER BY number_orders DESC
LIMIT 1;
