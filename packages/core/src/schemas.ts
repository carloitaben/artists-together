import { z } from "zod"

export const AnyJSONLiteral = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
])

export type AnyJSONLiteral = z.infer<typeof AnyJSONLiteral>

export type AnyJSON = AnyJSONLiteral | { [key: string]: AnyJSON } | AnyJSON[]

export const AnyJSON: z.ZodType<AnyJSON> = z.lazy(() =>
  z.union([AnyJSONLiteral, z.array(AnyJSON), z.record(AnyJSON)]),
)

export const AnyJSONString = z
  .string()
  .transform((value, context) => {
    try {
      return JSON.parse(value)
    } catch {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid JSON string",
      })

      return z.NEVER
    }
  })
  .pipe(AnyJSON)

export const AnyObject = z.object({}).passthrough()

export const EmptyObject = z.object({}).strict()
