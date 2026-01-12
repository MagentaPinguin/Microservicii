CREATE TYPE user_type AS ENUM ('student', 'profesor');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nume VARCHAR(100) NOT NULL,
    prenume VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    type user_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, nume, prenume, password_hash, type)
VALUES
('ana@test.ro', 'Popescu', 'Ana', '$2b$12$fakehash1', 'student'),
('ion@test.ro', 'Ionescu', 'Ion', '$2b$12$fakehash2', 'profesor');