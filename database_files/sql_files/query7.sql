SELECT *
FROM (
    SELECT
        TO_CHAR(o.timestamp, 'YYYY-MM') AS month,
        mi.name AS menu_item,
        COUNT(*) AS times_ordered,
        ROW_NUMBER() OVER (PARTITION BY TO_CHAR(o.timestamp, 'YYYY-MM') ORDER BY COUNT(*) DESC) AS rn
    FROM 
        orders o
    JOIN 
        LATERAL regexp_split_to_table(trim(both '{}' FROM o.itemlist::text), '-') AS item_id_str ON TRUE
    JOIN 
        menu_items mi ON mi.id = item_id_str::int
    GROUP BY 
        month, mi.name
) ranked
WHERE rn = 1
ORDER BY month;
