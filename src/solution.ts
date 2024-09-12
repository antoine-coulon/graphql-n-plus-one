import fs from "node:fs";
import path from "node:path";

import fastify from "fastify";
import mercurius, { MercuriusLoaders } from "mercurius";
import groupBy from "lodash.groupby";

import { makeDatabase } from "./db.js";
import {
  BooksSQLRepository,
  Review,
  ReviewsRepository,
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
};

interface Context {
  dependencies: {
    reviewsRepository: ReviewsRepository;
  };
}

declare module "mercurius" {
  interface MercuriusContext extends Context {}
}

/**
 * Mercurius est un adaptateur Fastify qui permet de créer des serveurs GraphQL.
 * Le concept de `loaders` est intégré de manière native et reprend les concepts
 * du pattern DataLoader (initialement librairie dataloader).
 */
const loaders: MercuriusLoaders<Context> = {
  Book: {
    /**
     * Le loader `reviews` est invoqué une seule fois par requête. Tous les livres
     * sont batchés et regroupés dans un tableau.
     */
    reviews: async (queries: Array<{ obj: Review }>, context) => {
      /**
       * On récupère les identifiants uniques des livres batchés, ce qui nous permet
       * de récupérer tous les avis en une seule requête.
       *
       * ex: `SELECT * FROM reviews WHERE book_id IN (1, 2, 3);`
       */
      const batchedBookIds = queries.map(({ obj }) => obj.id);
      const reviews =
        await context.dependencies.reviewsRepository.findByBookIds(
          batchedBookIds
        );
      /**
       * Pour que le loader puisse faire le lien entre les livres batchés
       * et les avis récupérés par livre, il faut préserver l'ordre initial du
       * batch, pour que chacun des avis soit associé au bon livre.
       * [                   [
       *   book1,     ->       [review1, review2],
       *   book2,     ->       [review3],
       *   book3      ->       [review4, review5, review6]
       * ]                  ]
       */
      const reviewsByBookId = groupBy(reviews, "book_id");
      return batchedBookIds.map((id) => reviewsByBookId[id] ?? []);
    },
  },
};

server
  .register(mercurius, {
    schema,
    resolvers,
    loaders,
    context: (): Context => ({
      dependencies: {
        reviewsRepository,
      },
    }),
    graphiql: true,
  })
  .listen(
    {
      port: PORT,
      host: HOST,
    },
    () => {
      console.log(`GraphiQL running at http://${HOST}:${PORT}/graphiql`);
    }
  );
