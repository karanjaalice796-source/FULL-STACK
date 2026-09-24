CREATE TABLE items (
    item_id INT PRIMARY KEY,
    item_name VARCHAR(100),
    price INT
);
INSERT INTO items (item_id, item_name, price) VALUES
(1, 'Small Desk', 100),
(2, 'Large desk', 300),
(3, 'Fan', 80);
SELECT * FROM items;
SELECT * FROM items 
WHERE price > 80;
SELECT * FROM items 
WHERE price <= 300;