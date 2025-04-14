import { AsyncLocalStorage } from "node:async_hooks"

export class AsyncContextInvariantError extends Error {
  constructor(options?: ErrorOptions) {
    super("Called async context outside scope.", options)
    this.name = "AsyncContextInvariantError"
  }
}

export function createContext<T>() {
  const storage = new AsyncLocalStorage<T>()
  return {
    use() {
      const result = storage.getStore()

      if (!result) {
        throw new AsyncContextInvariantError()
      }

      return result
    },
    run<R>(value: T, callback: () => R) {
      return storage.run<R>(value, callback)
    },
  }
}
