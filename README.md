This is a simple repository illustrating the N+1 Queries problem with GraphQL and SQLite.

### Observing the N+1 problem

1) Run the server

```sh
node --run start:problem
```

2) Use GraphiQL to run queries at http://127.0.0.1:4000/graphiql

3) Run the query

```graphql
query NPlusOneQuery {
  books {
    id 
    reviews {
      id
    }
  }
}
```

4) Check the console

You should see one initial query (`select * books`) (what we refer as being +1) and then N queries executed for each book review.

Having 10 books, we will have something like

```sql
# 1
SELECT * FROM books;

# + N
SELECT * FROM reviews WHERE book_id = 1;
SELECT * FROM reviews WHERE book_id = 2;
SELECT * FROM reviews WHERE book_id = 3;
SELECT * FROM reviews WHERE book_id = 4;
SELECT * FROM reviews WHERE book_id = 5;
```

### Solving the N+1 problem

1) Run the server with loaders enabled

```sh
node --run start:solution
```

Do the same 2) and 3) steps that are described above.

4) Check the console

You should see one initial query and then another query executed to get all reviews at once.

Having 10 books, we will have something like

```sql
# 1
SELECT * FROM books;

# + 1
SELECT * FROM reviews WHERE book_id IN (1,2,3,4,5,6,7,8,9,10);
```
