"use client"

import {
  FormProvider,
  getFieldsetProps,
  getFormProps,
  useField,
  useForm,
} from "@conform-to/react"
import { parseWithValibot } from "conform-to-valibot"
import { useActionState } from "react"
import { motion, AnimatePresence, Variants } from "motion/react"
import DialogTitle from "../DialogTitle"
import { sectionData } from "./lib"
import ProfileDialogContainer from "./ProfileDialogContainer"
import { updateProfile } from "~/lib/actions"
import { UpdateProfileFormSchema } from "~/lib/schemas"
import { IconName } from "~/lib/icons"
import Icon from "~/components/Icon"
import { useUser } from "~/lib/promises"

const array = Array.from(Array(5))

const variants: Variants = {
  hide: {
    opacity: 0,
    scale: 0,
  },
  show: {
    opacity: 1,
    scale: 1,
  },
}

function SocialMediaIcon({ name }: { name: string }) {
  const [field] = useField<string>(name)
  let icon: IconName | undefined

  if (field.value?.includes("instagram")) {
    icon = "Instagram"
  } else if (field.name.includes("twitter")) {
    icon = "Home"
  } else if (field.name.includes("youtube")) {
    icon = "Face"
  } else if (field.name.includes("youtu.be")) {
    icon = "Help"
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      {icon ? (
        <motion.div
          key={icon}
          initial="hide"
          animate="show"
          exit="hide"
          variants={variants}
          className="pointer-events-none absolute inset-y-0 right-0 grid size-10 place-items-center"
        >
          <Icon src={icon} alt="" className="size-4" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default function ProfileSectionSocialMedia() {
  const section = sectionData["social-media"]
  const user = useUser()

  const [lastResult, action, isPending] = useActionState(updateProfile, null)
  const [form, fields] = useForm({
    lastResult: lastResult?.result,
    onValidate(context) {
      return parseWithValibot(context.formData, {
        schema: UpdateProfileFormSchema,
      })
    },
    defaultValue: {
      links: user?.links,
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  })

  return (
    <ProfileDialogContainer id="social-media">
      <DialogTitle sm="inter" className="pb-4 md:pb-6">
        {section.label}
      </DialogTitle>
      <form
        {...getFormProps(form)}
        action={action}
        onPointerUp={(event) => {
          if (!(event.target instanceof HTMLInputElement)) return
          if (!event.target.hasAttribute("disabled")) return

          const enabledInputs = event.currentTarget.querySelectorAll(
            "input:not([disabled])",
          )

          const lastEnabledInput = enabledInputs.item(enabledInputs.length - 1)

          if (lastEnabledInput instanceof HTMLElement) {
            lastEnabledInput.focus()
          }
        }}
        onBlur={(event) => {
          if (!(event.target instanceof HTMLInputElement)) return
          if (isPending) return
          event.currentTarget.requestSubmit()
        }}
      >
        <FormProvider context={form.context}>
          <fieldset {...getFieldsetProps(fields.links)}>
            <legend className="px-3 pb-1 md:px-3.5">Links</legend>
            {array.map((_, index) => {
              const name = `${fields.links.name}[${index}]`
              const disabled = index > 0 && !fields.links.value?.[index - 1]

              return (
                <div
                  key={index}
                  role="group"
                  className="relative pb-1 last-of-type:pb-0 md:pb-2 md:last-of-type:pb-0"
                >
                  <label className="sr-only">
                    Socia media link {index + 1}
                  </label>
                  <input
                    name={name}
                    disabled={disabled}
                    className="block h-10 w-full rounded-4 bg-not-so-white pl-3.5 pr-10 text-gunpla-white-700 caret-gunpla-white-700 transition-shadow placeholder:text-gunpla-white-300"
                    placeholder="https://example.com/user"
                  />
                  <SocialMediaIcon name={name} />
                </div>
              )
            })}
          </fieldset>
        </FormProvider>
      </form>
    </ProfileDialogContainer>
  )
}
