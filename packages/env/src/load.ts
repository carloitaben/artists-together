import type { ZodTypeAny, TypeOf } from "node_modules/zod"
import { load as dotenvLoad } from "dotenv-mono"

export function load<T extends ZodTypeAny[]>(...schemas: T) {
  const output = dotenvLoad()

  // TODO: fix this any: Array to union -> iterate union with TypeOf<>
  return schemas.reduce<any>(
    (result, schema) => ({ ...result, ...schema.parse(output.env) }),
    {}
  )
}
