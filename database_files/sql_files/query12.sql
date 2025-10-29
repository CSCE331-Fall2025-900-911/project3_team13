SELECT name
FROM menu_items
WHERE ingredients LIKE CONCAT('%-', (
    SELECT id
    FROM inventory
    ORDER BY Quantity ASC
    LIMIT 1
), '-%') 
    OR ingredients LIKE CONCAT('%-', (
    SELECT id
    FROM inventory
    ORDER BY Quantity ASC
    LIMIT 1
), '}') 
    OR ingredients LIKE CONCAT('{', (
    SELECT id
    FROM inventory
    ORDER BY Quantity ASC
    LIMIT 1
), '-%');
