export function oneOf<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)]
}

export function between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
