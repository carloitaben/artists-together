export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
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
