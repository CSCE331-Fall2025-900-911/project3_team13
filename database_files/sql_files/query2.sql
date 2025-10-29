SELECT 
    EXTRACT(HOUR FROM timestamp) AS hour_of_day,
    COUNT(*) AS transactions,
    SUM(total) AS total_sales
FROM 
    transactions
GROUP BY 
    hour_of_day
ORDER BY 
    hour_of_day;
