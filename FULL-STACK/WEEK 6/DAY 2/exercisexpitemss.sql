DROP TABLE IF EXISTS items;
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    price INT NOT NULL
);
INSERT INTO items (item_name, price)
VALUES
('Small Desk', 100),
('Large Desk', 300),
('Fan', 80);
SELECT * FROM items
ORDER BY price ASC;
SELECT *
FROM items
WHERE price >= 80
