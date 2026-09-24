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
SELECT * FROM customers
WHERE last_name = 'Smith';
SELECT * FROM customers
WHERE last_name = 'Jones';
SELECT * FROM customers
WHERE first_name <> 'Scott';