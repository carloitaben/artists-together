import type { SafeParseReturnType, ZodTypeAny, TypeOf } from "zod"

export function getParams<T extends ZodTypeAny>(
  request: Request,
  schema: T,
): SafeParseReturnType<T, TypeOf<T>> {
  const params = new URL(request.url).searchParams
  const paramsObject = Object.fromEntries(params.entries())
  return schema.safeParse(paramsObject)
}
