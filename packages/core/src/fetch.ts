import createFetch from "fetch-retry"

export const fetch = createFetch(globalThis.fetch, {
  retryDelay: function (attempt) {
    return Math.pow(2, attempt) * 500
  },
})
