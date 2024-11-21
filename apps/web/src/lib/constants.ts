function getWebURL() {
  const vercel =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL

  if (vercel) {
    return new URL(`https://${vercel}`)
  }

  return new URL(`http://localhost:${process.env.PORT || 3000}`)
}

export const WEB_URL = getWebURL()
