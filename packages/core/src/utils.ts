function hasObjectPrototype(o: any): boolean {
  return Object.prototype.toString.call(o) === "[object Object]"
}

function isPlainObject(o: any): o is Object {
  if (!hasObjectPrototype(o)) {
    return false
  }

  // If has no constructor
  const ctor = o.constructor
  if (ctor === undefined) {
    return true
  }

  // If has modified prototype
  const prot = ctor.prototype
  if (!hasObjectPrototype(prot)) {
    return false
  }

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false
  }

  // Handles Objects created by Object.create(<arbitrary prototype>)
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false
  }

  // Most likely a plain Object
  return true
}

// Modified from Tanstack Query
// https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts#L205
export function hashArgs<T extends any[]>(args: T): string {
  return JSON.stringify(args, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = val[key]
            return result
          }, {} as any)
      : val,
  )
}

/**
 * Creates a memoized version of a function.
 * The memoized function caches the results of previous calls
 * based on the arguments provided.
 */
export function memo<T extends any[], R>(callback: (...args: T) => R) {
  const cache = new Map()

  return function withMemo(...args: T): R {
    const key = hashArgs(args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = callback.apply(callback, args)

    cache.set(key, result)
    return result
  }
}

/**
 * Returns a random integer between the specified minimum
 * and maximum values (inclusive).
 */
export function between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Throws a runtime error and shows a TypeScript type error
 * when a value is encountered that should be of type `never`.
 */
export function unreachable(
  value: never,
  message = "Unreachable value",
): never {
  throw new Error(`${message}: '${value}'`)
}

/**
 * Resolves a promise after the specified number of milliseconds.
 */
export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Randomly selects and returns one element from the provided array.
 */
export function draw<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]!
}

/**
 * An empty function.
 */
export function noop() {
  return () => {}
}
