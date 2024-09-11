import { AsyncLocalStorage } from "node:async_hooks"

export function createContext<T>() {
  const storage = new AsyncLocalStorage<T>()
  return {
    use() {
      const result = storage.getStore()

      if (!result) {
        throw new Error("No context available")
      }

      return result
    },
    run<R>(value: T, callback: () => R) {
      return storage.run<R>(value, callback)
    },
  }
}
