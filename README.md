# Trainix

## API Architecture

The `api` package is following the REST Principles, implementing screaming architecture.

### Controller naming

| Verb   | Path          | Action  |     |     |
| ------ | ------------- | ------- | --- | --- |
| GET    | /resource     | list    |     |     |
| GET    | /resource/:id | details |     |     |
| POST   | /resource     | create  |     |     |
| PUT    | /resource/:id | update  |     |     |
| DELETE | /resource/:id | destroy |     |     |

## How to run API e2e tests

To run API e2e tests you can follow this steps:

1. Start database containers stored in `/containers` (make sure that test-db is up and running).
2. Start the API in test mode with the following command `npm run start:api:test`
3. Execute `npm run test:api:e2e`.

> [!NOTE]
> Take into account that `npm run start:api:test` will autogenerate a new prisma client for test-db.
