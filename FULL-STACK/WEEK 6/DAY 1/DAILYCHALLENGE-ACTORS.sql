CREATE TABLE actors (
    actor_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    age INT,
    number_oscars INT DEFAULT 0
);

INSERT INTO actors (first_name, last_name, age, number_oscars)
VALUES
('Tom', 'Hanks', 69, 2),
('Denzel', 'Washington', 71, 2),
('Leonardo', 'DiCaprio', 51, 1);

SELECT * FROM actors;

SELECT COUNT(*) AS total_actors
FROM actors;

INSERT INTO actors (first_name, last_name, age, number_oscars)
VALUES ('John', 'Kimberly', 30, 0);

INSERT INTO actors (first_name, last_name, age, number_oscars)
VALUES ('John', 'Doe', NULL, 0);

INSERT INTO actors (first_name, last_name, age)
VALUES ('Will', 'Smith', 57);