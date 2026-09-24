DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL
);
INSERT INTO customers (first_name, last_name)
VALUES
('Greg', 'Jones'),
('Sandra', 'Jones'),
('Scott', 'Scott'),
('Trevor', 'Green'),
('Melanie', 'Johnson');
SELECT first_name, last_name
FROM customers
ORDER BY first_name ASC
LIMIT 3;
SELECT last_name
FROM customers
ORDER BY last_name DESC;