import type { RoutesWithParams } from "remix-routes"
import { $params } from "remix-routes"
import type { SafeParseReturnType, ZodTypeAny, TypeOf, ZodObject } from "zod"

export function getSearchParams<T extends ZodTypeAny>(
  request: Request,
  schema: T,
): SafeParseReturnType<T, TypeOf<T>> {
  const params = new URL(request.url).searchParams
  const paramsObject = Object.fromEntries(params.entries())
  return schema.safeParse(paramsObject)
}

// Route extends keyof RoutesWithParams,
// Params extends RoutesWithParams[Route]["params"]

export function getRouteParams<Route extends keyof RoutesWithParams>(
  route: Route,
  {
    params,
    schema,
  }: {
    params: { readonly [key: string]: string | undefined }
    schema: ZodObject<{
      [K in keyof RoutesWithParams[Route]["params"]]: ZodTypeAny
    }>
  },
) {
  const result = schema.safeParse(params)

  if (result.success) {
    return {
      success: true,
      data: $params(route, params),
    }
  } else {
    return result
  }
}
