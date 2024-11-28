CREATE DATABASE password_manager;

\c password_manager;

CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS public.passwords (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    service VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    url VARCHAR(255),
    protected BOOLEAN DEFAULT FALSE,
    CONSTRAINT passwords_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);