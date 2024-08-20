"use client"

import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { forwardRef } from "react"
import type { IconName } from "~/lib/types/icons"
import Icon from "~/components/Icon"
import ModalContainer from "../ModalContainer"
import ModalTitle from "../ModalTitle"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { updateSchema } from "~/services/auth/shared"
import { update } from "~/services/auth/actions"

const keys = Array(5)
  .fill(null)
  .map((_, index) => index)

function DyamicLinkIcon({ children = "instagram" }: { children?: string }) {
  let icon: IconName | undefined

  if (children.includes("instagram")) {
    icon = "instagram"
  } else if (children.includes("twitter")) {
    icon = "home"
  } else if (children.includes("youtube")) {
    icon = "face"
  } else if (children.includes("youtu.be")) {
    icon = "help"
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      {icon ? (
        <motion.div
          key={icon}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="pointer-events-none absolute inset-y-0 right-0 grid size-10 place-items-center"
        >
          <Icon name={icon} alt="" className="size-3.5" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function SocialMediaInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <li className="relative">
      <input
        {...props}
        type="text"
        name="social"
        placeholder="https://example.com/user"
        className="w-full rounded-2xl bg-not-so-white px-3 py-2.5 text-gunpla-white-700 placeholder-gunpla-white-300 caret-gunpla-white-500"
      />
      <DyamicLinkIcon />
    </li>
  )
}

type Props = ComponentProps<typeof ModalContainer>

function ProfileSocialMedia(
  props: Props,
  ref: ForwardedRef<ComponentRef<typeof ModalContainer>>,
) {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: updateSchema })
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  })

  return (
    <ModalContainer {...props} ref={ref}>
      <ModalTitle>Social media</ModalTitle>
      <form id={form.id} onSubmit={form.onSubmit} action={update} noValidate>
        <label>Links</label>
        <ul className="grid gap-2">
          {keys.map((key) => (
            <SocialMediaInput key={key} />
          ))}
        </ul>
      </form>
    </ModalContainer>
  )
}

export default forwardRef(ProfileSocialMedia)
