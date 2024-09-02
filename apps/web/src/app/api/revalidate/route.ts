import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { parseSearchParams } from "~/lib/server"

const searchParams = z.object({
  token: z
    .string()
    .refine((string) => string === String(process.env.REVALIDATION_TOKEN), {
      message: "Invalid revalidation token",
    }),
  tag: z.string().array().default([]),
  slug: z
    .string()
    .refine((string) => string.startsWith("/"))
    .array()
    .default([]),
  /**
   * Whether to precache revalidated paths.
   *
   * @default true
   */
  precache: z.boolean().default(true),
})

async function precache(slug: string) {
  const url = new URL(slug, process.env.NEXT_PUBLIC_WEB_URL)

  return fetch(url, {
    cache: "no-store",
  })
    .then((response) => response.ok)
    .catch(() => false)
}

export async function GET(request: NextRequest) {
  const params = parseSearchParams(request.nextUrl.searchParams, {
    schema: searchParams,
  })

  if (!params.success) {
    return NextResponse.json(params.error, {
      status: 400,
    })
  }

  const tagPromises = params.data.tag.map(async (tag) => {
    try {
      revalidateTag(tag)
      return { tag, status: "success" }
    } catch (error) {
      console.error(error)
      return { tag, status: "error" }
    }
  })

  const slugPromises = params.data.slug.map(async (slug) => {
    try {
      revalidatePath(slug, "page")

      if (params.data.precache) {
        await precache(slug)
      }

      return { slug, status: "success" }
    } catch (error) {
      console.error(error)
      return { slug, status: "error" }
    }
  })

  const promises = [tagPromises, slugPromises].flat()
  const result = await Promise.all(promises)
  return NextResponse.json(result)
}
