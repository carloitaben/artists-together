function getWebURL() {
  const vercel =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      : process.env.NEXT_PUBLIC_VERCEL_URL

  if (vercel) {
    return new URL(`https://${vercel}`)
  }

  return new URL(`http://localhost:${process.env.PORT || 3000}`)
}

export const WEB_URL = getWebURL()
