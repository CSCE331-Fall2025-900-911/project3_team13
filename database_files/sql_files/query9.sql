SELECT 
    mi.name AS drink_name,
    COUNT(*) AS times_ordered
FROM 
    customers c
JOIN 
    LATERAL regexp_split_to_table(trim(both '{}' FROM c.history::text), '-') AS order_id_str ON TRUE
JOIN 
    orders o ON o.id = order_id_str::int
JOIN 
    LATERAL regexp_split_to_table(trim(both '{}' FROM o.itemlist::text), '-') AS item_id_str ON TRUE
JOIN 
    menu_items mi ON mi.id = item_id_str::int
WHERE 
    c.id = 1  -- Replace with any customer ID
GROUP BY 
    mi.name
ORDER BY 
    times_ordered DESC;
