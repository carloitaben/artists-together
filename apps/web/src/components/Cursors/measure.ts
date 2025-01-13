const measurements = new Map<string, DOMRect>()

export function measure(options: { element: Element; attribute: string }) {
  const cache = measurements.get(options.attribute)

  if (cache) return cache

  const rect = options.element.getBoundingClientRect()
  measurements.set(options.attribute, rect)
  return rect
}

export function invalidate(attribute: string) {
  measurements.delete(attribute)
}
