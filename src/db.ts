import { DatabaseSync } from "node:sqlite";

export function makeDatabase() {
  const database = new DatabaseSync(":memory:");

  database.exec(`
        CREATE TABLE books(
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL
        ) STRICT;
    
        CREATE TABLE reviews(
            id INTEGER PRIMARY KEY,
            rating INTEGER NOT NULL,
            book_id INTEGER NOT NULL,
            FOREIGN KEY (book_id) REFERENCES books(id)
        ) STRICT;

        INSERT INTO books (title) VALUES ('The Great Gatsby');
        INSERT INTO books (title) VALUES ('1984');
        INSERT INTO books (title) VALUES ('Brave New World');
        INSERT INTO books (title) VALUES ('Fahrenheit 451');
        INSERT INTO books (title) VALUES ('The Catcher in the Rye');
        INSERT INTO books (title) VALUES ('The Bell Jar');
        INSERT INTO books (title) VALUES ('The Color Purple');
        INSERT INTO books (title) VALUES ('Beloved');
        INSERT INTO books (title) VALUES ('The Handmaid''s Tale');
        INSERT INTO books (title) VALUES ('The Road');
    
        INSERT INTO reviews (book_id, rating) VALUES (1, 5);
        INSERT INTO reviews (book_id, rating) VALUES (1, 4);
        INSERT INTO reviews (book_id, rating) VALUES (1, 3);
        INSERT INTO reviews (book_id, rating) VALUES (1, 2);
        INSERT INTO reviews (book_id, rating) VALUES (1, 1);
        INSERT INTO reviews (book_id, rating) VALUES (2, 10);
        INSERT INTO reviews (book_id, rating) VALUES (2, 9);
        INSERT INTO reviews (book_id, rating) VALUES (2, 8);
        INSERT INTO reviews (book_id, rating) VALUES (2, 7);
        INSERT INTO reviews (book_id, rating) VALUES (2, 6);
        INSERT INTO reviews (book_id, rating) VALUES (3, 6);
        INSERT INTO reviews (book_id, rating) VALUES (3, 7);
        INSERT INTO reviews (book_id, rating) VALUES (3, 8);
        INSERT INTO reviews (book_id, rating) VALUES (3, 9);
        INSERT INTO reviews (book_id, rating) VALUES (3, 10);
        INSERT INTO reviews (book_id, rating) VALUES (4, 1);
        INSERT INTO reviews (book_id, rating) VALUES (4, 2);
        INSERT INTO reviews (book_id, rating) VALUES (4, 3);
        INSERT INTO reviews (book_id, rating) VALUES (4, 4);
        INSERT INTO reviews (book_id, rating) VALUES (4, 5);
        INSERT INTO reviews (book_id, rating) VALUES (5, 5);
        INSERT INTO reviews (book_id, rating) VALUES (5, 4);
        INSERT INTO reviews (book_id, rating) VALUES (5, 3);
        INSERT INTO reviews (book_id, rating) VALUES (5, 2);
        INSERT INTO reviews (book_id, rating) VALUES (5, 1);
`);

  return database;
}
