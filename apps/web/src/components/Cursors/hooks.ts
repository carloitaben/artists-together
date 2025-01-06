import { queryOptions, useQueryClient } from "@tanstack/react-query"
import { useMotionValueEvent, useScroll } from "motion/react"
import { useCallback, useEffect, useRef } from "react"
import { onMeasure } from "~/lib/media"

const measureQueryOptions = ({
  attribute,
  element,
}: {
  attribute: string
  element: Element
}) =>
  queryOptions({
    queryKey: ["cursors", "measure", attribute],
    staleTime: Infinity,
    queryFn() {
      console.log("measuring element", attribute)
      return element.getBoundingClientRect() || null
    },
  })

export function useMeasurePrecisionArea() {
  const cleanups = useRef(new Set<VoidFunction>())
  const queryClient = useQueryClient()
  const scroll = useScroll()

  useMotionValueEvent(scroll.scrollY, "change", () => {
    queryClient.invalidateQueries({
      exact: false,
      queryKey: ["cursors", "measure"],
    })
  })

  useEffect(() => {
    const cleanupsArray = cleanups.current
    return () => cleanupsArray.forEach((cleanup) => cleanup())
  }, [])

  return useCallback(
    (options: Parameters<typeof measureQueryOptions>[0]) => {
      const queryOptions = measureQueryOptions(options)
      const queryData = queryClient.getQueryData(queryOptions.queryKey)

      const cleanup = onMeasure(options.element, () =>
        queryClient.invalidateQueries({
          queryKey: queryOptions.queryKey,
        }),
      )

      cleanups.current.add(cleanup)

      return queryData
    },
    [queryClient],
  )
}
