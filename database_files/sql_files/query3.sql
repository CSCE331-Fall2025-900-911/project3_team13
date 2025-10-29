SELECT SUM(total) FROM (SELECT * FROM transactions 
WHERE timestamp >= '2025-07-09' AND timestamp < '2025-07-10' ORDER BY total DESC LIMIT 10) AS transactionsResult;