SELECT cardinality(string_to_array(trim(both '{}' from ingredients), '-')) AS ingredient_count
FROM menu_items WHERE id = 3;