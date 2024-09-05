-- Check if the database 'library' exists, create it if it does not
-- Note: In PostgreSQL, you need to execute this outside the database context as you cannot check/create a database within the same session.

-- Install the extension dblink in order to create a database if it doesn't exist. 
create extension dblink;

DO
$$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'library') THEN
      PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE library');
   END IF;
END
$$;

-- Create test db for integration testing called library-test
DO
$$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'library_test') THEN
      PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE library_test');
   END IF;
END
$$;

-- Connect to the 'library' database
\c library;

-- Check if the 'users' table exists, create it if it does not
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Check if the 'books' table exists, create it if it does not
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(13),
    published_year INT
);

-- Insert books into the 'books' table
INSERT INTO books (title, author, isbn, published_year) VALUES
    ('Don Quixote', 'Miguel de Cervantes', '9780060934347', 1605),
    ('The Divine Comedy', 'Dante Alighieri', '9780140448955', 1320),
    ('Macbeth', 'William Shakespeare', '9780743477109', 1623),
    ('The Prince', 'Niccolò Machiavelli', '9780199535699', 1532),
    ('The Republic', 'Plato', '9780140455113', -380),
    ('One Hundred Years of Solitude', 'Gabriel García Márquez', '9780060883287', 1967),
    ('War and Peace', 'Leo Tolstoy', '9780199232765', 1869),
    ('Moby-Dick', 'Herman Melville', '9780142437247', 1851),
    ('Ulysses', 'James Joyce', '9780199535675', 1922),
    ('In Search of Lost Time', 'Marcel Proust', '9780141180341', 1913),
    ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 1925),
    ('The Iliad', 'Homer', '9780140447941', -750),
    ('Crime and Punishment', 'Fyodor Dostoevsky', '9780140449136', 1866),
    ('The Odyssey', 'Homer', '9780140268867', -725),
    ('The Brothers Karamazov', 'Fyodor Dostoevsky', '9780374528379', 1880),
    ('Pride and Prejudice', 'Jane Austen', '9780141439518', 1813),
    ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 1960),
    ('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 1951),
    ('The Canterbury Tales', 'Geoffrey Chaucer', '9780140424386', 1400),
    ('Les Misérables', 'Victor Hugo', '9780451419439', 1862),
    ('Anna Karenina', 'Leo Tolstoy', '9780140449174', 1877),
    ('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 1937),
    ('Fahrenheit 451', 'Ray Bradbury', '9781451673319', 1953),
    ('The Lord of the Rings', 'J.R.R. Tolkien', '9780544003415', 1954),
    ('Harry Potter and the Philosophers Stone', 'J.K. Rowling','9781408855652', 1997);
