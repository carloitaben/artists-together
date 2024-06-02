function getWebURL() {
  const vercel =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL

  return vercel
    ? new URL(`https://${vercel}`)
    : new URL(`http://localhost:${process.env.PORT || 3000}`)
}

export const WEB_URL = getWebURL()
