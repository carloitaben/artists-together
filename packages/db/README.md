# Artists Together Database

The source code of the database for all Artist Together apps.

## Stack

- `planetscale`
- `drizzle-orm`
- `drizzle-kit`
- `drizzle-zod`

## Development

Install workspace dependencies in the root directory:

```shell
pnpm install
```

[Create a PlanetScale account](https://auth.planetscale.com/sign-up). Then, create a `.env` file in the repository root directory with the contents of the `.env.example` file and put in values for every variable prefixed with `DATABASE` with the values provided by PlanetScale:

```shell
touch .env
```

Run the `push` script to sync the PlanetScale database with the ORM schema. Learn more about prototyping with `db push` in the [Drizzle ORM documentation](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push).

```shell
pnpm --filter db push
```
