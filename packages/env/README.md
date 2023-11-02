# Artists Together Environment Variables

An utility for parsing the Artist Together monorepo environment variables in a typesafe way.

## Stack

- `dotenv-mono`
- `zod`

## Usage

Import the library and select the schemas needed for that project.

```ts
// src/lib/env.ts
import { load, schema } from "env"

// Require `db` environment variables
export const env = load(schema.db)

// Require multiple environment variables
export const env = load(schema.db, schema.web, schema.node)
```

That's it. Consume your environment variables from the `env` constant to.
