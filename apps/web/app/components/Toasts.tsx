import { useSearchParams } from "@remix-run/react"
import { useStore } from "@nanostores/react"
import { atom } from "nanostores"
import type { ReactNode } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useClickAway, useHoverDirty } from "react-use"
import type { Transition, Variants } from "framer-motion"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "./Icon"

type ToastData = {
  id: string
  content: ReactNode
  options?: {
    duration?: number
  }
}

const $toasts = atom<ToastData[]>([])

function makeId() {
  return Math.random().toString(32).slice(2)
}

function emitMessage(content: ReactNode, options?: ToastData["options"]) {
  const id = makeId()

  $toasts.set([
    ...$toasts.get(),
    {
      id,
      content,
      options,
    },
  ])
}

function emitError(content: ReactNode = "Oops! Something went wrong…") {
  emitMessage(content)
}

export const emit = {
  message: emitMessage,
  error: emitError,
}

const variants = {
  chip: {
    initial: {
      translateY: "175%",
    },
    animate: (index: number) => ({
      translateY: `${index * 100}%`,
      scale: 1 - index / 10,
    }),
    open: (index: number) => ({
      translateY: "0%",
      scale: 1,
      transition: {
        ...transition,
        delay: index / 75,
      },
    }),
    exit: (index: number) => ({
      translateY: "-100%",
      translateX: index === 0 ? "-50%" : "0%",
      scale: 0,
      opacity: 0,
    }),
  },
  content: {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        type: "tween",
        delay: 0.15,
      },
    },
    exit: {
      opacity: 0,
    },
  },
} satisfies Record<string, Variants>

const transition: Transition = {
  type: "spring",
  mass: 0.5,
}

function Toast({
  toast,
  index,
  open,
}: {
  toast: ToastData
  index: number
  open: boolean
}) {
  const close = useCallback(() => {
    $toasts.set($toasts.get().filter((t) => t.id !== toast.id))
  }, [toast.id])

  useEffect(() => {
    if (open || index > 0) return
    const timeout = setTimeout(close, toast.options?.duration || 5000)
    return () => clearTimeout(timeout)
  }, [close, index, open, toast.options?.duration])

  return (
    <motion.div
      variants={variants.chip}
      transition={transition}
      custom={index}
      initial="initial"
      animate={["animate", open ? "open" : ""]}
      exit="exit"
      className="rounded-full bg-not-so-white text-sm text-gunpla-white-700 shadow-button whitespace-nowrap"
    >
      <motion.div
        className="flex items-center pl-6"
        variants={variants.content}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <span>{toast.content}</span>
        <button
          type="button"
          className="w-12 h-12 flex items-center justify-center"
          onClick={close}
        >
          <Icon name="close" alt="Close" className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function Toasts() {
  const toasts = useStore($toasts)
  const [params, setParams] = useSearchParams()
  const [open, setOpen] = useState(false)

  const ref = useRef(null)
  const hover = useHoverDirty(ref)

  useClickAway(ref, () => {
    setOpen(false)
  })

  useEffect(() => {
    const error = params.get("error")
    const toast = params.get("toast") || ""

    if (!error && !toast) return

    setParams(
      (params) => {
        if (error) {
          emit.error()
          params.delete("error")
        } else if (toast) {
          emit.message(toast)
          params.delete("toast")
        }
        return params
      },
      { replace: true },
    )
  }, [params, setParams])

  useEffect(() => {
    if (toasts.length) {
      setOpen(hover)
    } else {
      setOpen(false)
    }
  }, [hover, toasts.length])

  return (
    <div className="fixed inset-x-2 bottom-16 sm:bottom-2 pointer-events-none grid place-items-center z-[999] sm:left16">
      <motion.ol
        ref={ref}
        className="flex flex-col gap-2 pointer-events-auto items-center relative"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index, array) => (
            <motion.li
              key={toast.id}
              transition={transition}
              layoutId={toast.id}
              layout="position"
            >
              <Toast
                toast={toast}
                index={array.length - (index + 1)}
                open={open}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ol>
    </div>
  )
}
