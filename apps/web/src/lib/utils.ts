export function unreachable(value: never): never {
  throw new Error(`Unreachable: ${value}`)
}

export function oneOf<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)]
}

export function between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export async function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
