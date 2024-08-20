import "server-only"

export function error<T extends string>(error: { cause: T; message?: string }) {
  return {
    error,
  } as const
}
