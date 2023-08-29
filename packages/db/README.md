# Artists Together Database

The source code of the database for all Artist Together apps.

## Stack

- `turso`
- `drizzle-orm`
- `drizzle-kit`
- `drizzle-zod`

## Development

Install workspace dependencies in the root directory:

```shell
pnpm install
```

Create a [Turso account](https://turso.tech/app). Then, [install the Turso CLI](https://docs.turso.tech/reference/turso-cli#installation) and [sqld](https://github.com/libsql/sqld/blob/main/docs/BUILD-RUN.md).

Authenticate with the Turso CLI. You only need to do this once per machine.

```shell
turso auth
```

Run the `push` script to sync the database with the ORM schema. Learn more about prototyping with `db push` in the [Drizzle ORM documentation](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push).

```shell
pnpm --filter db push
```

From now on, you can open a local `sqld` instance with the `dev` command:

```shell
pnpm --filter db dev
```
