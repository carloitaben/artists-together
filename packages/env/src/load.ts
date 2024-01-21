import type { ZodTypeAny, TypeOf } from "zod"
import { load as dotenvLoad } from "dotenv-mono"

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type Merge<U> = UnionToIntersection<U> extends infer O
  ? { [K in keyof O]: O[K] }
  : never

export function load<T extends ZodTypeAny[]>(
  ...schemas: T
): Merge<TypeOf<T[number]>> {
  // Railway does weird things when using dotenv so we read the variables directly
  const env = process.env.RAILWAY_PROJECT_ID ? process.env : dotenvLoad().env

  console.log(env)

  return schemas.reduce<TypeOf<T[number]>>(
    (result, schema) => ({ ...result, ...schema.parse(env) }),
    {}
  )
}
