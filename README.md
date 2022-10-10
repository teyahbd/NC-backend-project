# Northcoders House of Games API

## About

## Getting Started

In order to connect to the test and development databases locally, you will need to create a `.env` file for each database containing the appropriate environment variable.

For the test database, create a new file in the main project directory named `.env.test` and add the line

```
PGDATABASE=nc_games_test
```

For the development database, create a similar file named `.env.development` with the line

```
PGDATABASE=nc_games
```

These new `.env` files should be added to your `.gitignore` file.
