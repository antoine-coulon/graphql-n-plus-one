import { DatabaseSync } from "node:sqlite";

import { Schema } from "@effect/schema";
import { pipe } from "effect/Function";

const ReviewSchema = Schema.Struct({
  id: Schema.Number,
  book_id: Schema.Number,
  rating: Schema.Number,
});

export interface Review extends Schema.Schema.Type<typeof ReviewSchema> {}

const BookSchema = Schema.Struct({
  id: Schema.Number,
  title: Schema.String,
  reviews: Schema.Array(ReviewSchema),
});

export interface Book extends Schema.Schema.Type<typeof BookSchema> {}

export interface BooksRepository {
  findAll(): Promise<Book[]>;
}

export class BooksSQLRepository {
  constructor(private database: DatabaseSync) {}

  async findAll() {
    console.log(`Query > "SELECT * FROM books"`);

    return this.database.prepare("SELECT * FROM books").all();
  }
}

export interface ReviewsRepository {
  findByBookId(bookId: number): Promise<ReadonlyArray<Review>>;
  findByBookIds(bookIds: number[]): Promise<ReadonlyArray<Review>>;
}

export class ReviewsSQLRepository implements ReviewsRepository {
  constructor(private database: DatabaseSync) {}

  findByBookId(bookId: number) {
    console.log(`Query > "SELECT * FROM reviews WHERE book_id = ${bookId}"`);

    return pipe(
      this.database
        .prepare("SELECT * FROM reviews WHERE book_id = ?")
        .all(bookId),
      Schema.decodeUnknownPromise(Schema.Array(ReviewSchema))
    );
  }

  findByBookIds(bookIds: number[]) {
    const idList = bookIds.join(",");
    const placeholders = bookIds.map(() => "?").join(",");

    console.log(`Query > "SELECT * FROM reviews WHERE book_id IN (${idList})"`);

    return pipe(
      this.database
        .prepare(`SELECT * FROM reviews WHERE book_id IN (${placeholders})`)
        .all(...bookIds),
      Schema.decodeUnknownPromise(Schema.Array(ReviewSchema))
    );
  }
}
