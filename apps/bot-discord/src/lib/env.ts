import { load, schema } from "env"

export const env = load(schema.db, schema.botDiscord, schema.node)
