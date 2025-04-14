if ("document" in globalThis) {
  throw Error("This module cannot be imported from a client module.")
}
