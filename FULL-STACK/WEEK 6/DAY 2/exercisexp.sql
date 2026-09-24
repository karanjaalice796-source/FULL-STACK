
SELECT *
FROM customers;


-- 2. Display first and last names as full_name
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM customers;


-- 3. Get unique account creation dates
SELECT DISTINCT create_date
FROM customers;


-- 4. Get all customers ordered by first name descending
SELECT *
FROM customers
ORDER BY first_name DESC;


-- 5. Get film details ordered by rental rate
SELECT
    film_id,
    title,
    description,
    release_year,
    rental_rate
FROM film
ORDER BY rental_rate ASC;


-- 6. Get address and phone number of customers in Texas
SELECT address, phone
FROM address
WHERE district = 'Texas';


-- 7. Get movies with ID 15 or 150
SELECT *
FROM film
WHERE film_id IN (15, 150);


-- 8. Find your favorite movie
SELECT
    film_id,
    title,
    description,
    length,
    rental_rate
FROM film
WHERE title = 'Academy Dinosaur';


-- 9. Movies starting with first two letters
SELECT
    film_id,
    title,
    description,
    length,
    rental_rate
FROM film
WHERE title ILIKE 'Ac%';


-- 10. Find the 10 cheapest movies
SELECT *
FROM film
ORDER BY rental_rate ASC
LIMIT 10;


-- 11. Find the next 10 cheapest movies
SELECT *
FROM film
ORDER BY rental_rate ASC
LIMIT 10 OFFSET 10;


-- 12. Join customer and payment
SELECT
    customer.customer_id,
    customer.first_name,
    customer.last_name,
    payment.amount,
    payment.payment_date
FROM customer
JOIN payment
    ON customer.customer_id = payment.customer_id
ORDER BY customer.customer_id ASC;


-- 13. Find movies that are not in inventory
SELECT *
FROM film
WHERE film_id NOT IN (
    SELECT film_id
    FROM inventory
);


-- 14. Find which city is in which country
SELECT
    city.city,
    country.country
FROM city
JOIN country
    ON city.country_id = country.country_id;


-- 15. Bonus: See how sellers are doing
SELECT
    customer.customer_id,
    customer.first_name,
    customer.last_name,
    payment.amount,
    payment.payment_date,
    payment.staff_id
FROM customer
JOIN payment
    ON customer.customer_id = payment.customer_id
ORDER BY payment.staff_id ASC;