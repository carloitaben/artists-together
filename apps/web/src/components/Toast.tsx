"use client"

import { ReactNode, useCallback, useEffect, useId, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { atom, map } from "nanostores"
import { useStore } from "@nanostores/react"

import Icon from "./Icon"

type ToastData = {
  id: string
  content: ReactNode
  options?: {
    duration?: number
  }
}

const $toast = atom<ToastData | null>(null)

const $error = map<Record<string, number>>({})

function emitMessage(content: ReactNode, options?: ToastData["options"]) {
  const id = Math.random().toString(32).slice(2)

  $toast.set({
    id,
    content,
    options,
  })
}

function emitError(content: ReactNode = "Oops! Something went wrong…") {
  const id = Math.random().toString(32).slice(2)
  const count = $error.get()[id] || 0
  $error.setKey(id, count + 1)

  if (count + 1 > 3) {
    emitMessage(
      <>
        {content}{" "}
        <button type="button" className="underline">
          Contact support
        </button>
      </>,
    )
  }

  emitMessage(content)
}

export const emit = {
  message: emitMessage,
  error: emitError,
}

export function useToast() {
  const id = useId()

  const emitMessage = useCallback(
    (content: ReactNode, options?: ToastData["options"]) => {
      $toast.set({
        id,
        content,
        options,
      })
    },
    [id],
  )

  const emitError = useCallback(
    (
      content: ReactNode = "Oops! Something went wrong…",
      options?: ToastData["options"],
    ) => {
      const count = $error.get()[id] || 0
      const value = count + 1

      $error.setKey(id, value)

      if (value < 3) {
        return emitMessage(content, options)
      }

      return emitMessage(
        <>
          {content} <button className="underline">Contact support</button>
        </>,
        options,
      )
    },
    [emitMessage, id],
  )

  return {
    error: emitError,
    message: emitMessage,
  }
}

export default function Toast() {
  const toast = useStore($toast)
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (!params.get("error")) return
    const newParams = new URLSearchParams(params)
    newParams.delete("error")
    router.push(pathname + "?" + newParams.toString())
    emit.error()
  }, [params, pathname, router])

  useEffect(() => {
    if (!toast || hover) return

    const timeout = setTimeout(
      () => $toast.set(null),
      toast.options?.duration || 5000,
    )

    return () => clearTimeout(timeout)
  }, [hover, toast])

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 flex justify-center">
      <AnimatePresence mode="wait">
        {toast ? (
          <motion.div
            key={toast.id}
            className="rounded-full bg-not-so-white text-sm text-gunpla-white-700 shadow-button"
            initial={{ y: "175%" }}
            animate={{ y: "0%" }}
            exit={{ y: "175%" }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", mass: 0.1 }}
            onHoverStart={() => setHover(true)}
            onHoverEnd={() => setHover(false)}
          >
            <motion.div
              className="flex items-center pl-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="-translate-y-px">{toast.content}</p>
              <button type="button" onClick={() => $toast.set(null)}>
                <Icon icon="close" label="Close" className="h-12 w-12 p-4" />
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
