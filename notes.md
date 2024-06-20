npm run test:

to test: we want to create a brand new database and delete it after

1. npm run test:db:up = spinning up the test database (using a custom docker compose file)
2. npx dotenv-cli -e .env.test - load environment variables and run migrations on our database (so it looks updated)
3. load environment variables again - and run our tests
4. spin our database down (docker compose down deletes your database)



