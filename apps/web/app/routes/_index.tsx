import { Await, useLoaderData } from "@remix-run/react"
import { defer, type V2_MetaFunction } from "@vercel/remix"
import { Suspense } from "react"

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }]
}

export const config = { runtime: "edge" }

export async function loader() {
  const blocking = "foo"
  const deferred = new Promise<string>((resolve) => setTimeout(() => resolve("bar"), 2000))

  return defer({ blocking, deferred })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <main>
      <h1>hello there {data.blocking}</h1>
      <Suspense>
        <Await resolve={data.deferred}>
          {(deferred) => <div className="p-4 bg-theme-300 text-theme-700">{deferred}</div>}
        </Await>
      </Suspense>
    </main>
  )
}
