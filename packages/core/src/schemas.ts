import * as v from "valibot"

export type AnyJSON =
  | string
  | number
  | boolean
  | null
  | { [key: string]: AnyJSON }
  | AnyJSON[]

const AnyJSON: v.GenericSchema<AnyJSON> = v.lazy(() =>
  v.union([
    v.string(),
    v.number(),
    v.boolean(),
    v.null(),
    v.record(v.string(), AnyJSON),
    v.array(AnyJSON),
  ]),
)

export const AnyJSONString = v.pipe(
  v.string(),
  v.rawTransform((context) => {
    try {
      return JSON.parse(context.dataset.value)
    } catch {
      context.addIssue({
        message: "Invalid stringified JSON",
        input: context.dataset.value,
      })

      return context.NEVER
    }
  }),
  v.unknown(),
)

export type AnyJSONString = v.InferInput<typeof AnyJSONString>

export const JSONStringify = v.rawTransform((context) => {
  try {
    return JSON.stringify(context.dataset.value)
  } catch (error) {
    context.addIssue({
      message: "Error while stringifying value",
      input: context.dataset,
    })

    return context.NEVER
  }
})
