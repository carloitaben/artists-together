export const ATTR_NAME_DATA_CURSOR_PRECISION = "data-precision"

export const SCOPE_ROOT = "root"

export const SCOPE_DELIMITER = "$"

export const measurements = new Map<string, DOMRect>()

export function createPrecisionScope(...scopes: string[]) {
  return scopes.join(SCOPE_DELIMITER)
}

export function measure(key: string, element: Element) {
  const cache = measurements.get(key)

  if (cache) return cache

  const rect = element.getBoundingClientRect()
  measurements.set(key, rect)
  return rect
}
