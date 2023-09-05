# Artists Together Database

The source code of the database for all Artist Together apps.

## Stack

- `drizzle-kit`
- `drizzle-orm`
- `drizzle-zod`
- `sqld`
- `zod`

## Development

Install [sqld](https://github.com/libsql/sqld/blob/main/docs/BUILD-RUN.md) in your machine.

> **Note** 
> If you are using Windows, install the [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) and follow the `sqld` installaton steps for Linux.

Install workspace dependencies in the root directory:

```shell
pnpm install
```

Run the `push` script to bootstrap the database:

```shell
pnpm --filter db push
```

> **Note**
> When making changes in the database schema, run the `push` script to apply the updates. Learn more about prototyping with `db push` in the [Drizzle ORM documentation](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push).

From now on, you can open a local `sqld` instance using the `dev` command:

```shell
pnpm --filter db dev
```

You can visually browse and modify the database using the `studio` command:

```shell
pnpm --filter db studio
```
