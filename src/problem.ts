import fs from "node:fs";
import path from "node:path";

import fastify from "fastify";
import mercurius from "mercurius";

import { makeDatabase } from "./db.js";
import {
  Book,
  BooksSQLRepository,
  ReviewsSQLRepository,
} from "./repositories.js";

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number.parseInt(process.env.PORT || "4000");

const server = fastify();

const schema = fs
  .readFileSync(path.join(process.cwd(), "src", "schema.gql"))
  .toString();

const database = makeDatabase();
const booksRepository = new BooksSQLRepository(database);
const reviewsRepository = new ReviewsSQLRepository(database);

const resolvers = {
  Query: {
    books: () => booksRepository.findAll(),
  },
  Book: {
    reviews: (book: Book) => reviewsRepository.findByBookId(book.id),
  },
};

server
  .register(mercurius, {
    schema,
    resolvers,
    graphiql: true,
  })
  .listen(
    {
      port: PORT,
      host: HOST,
    },
    () => {
      console.log(`Server running at http://${HOST}:${PORT}`);
    }
  );
