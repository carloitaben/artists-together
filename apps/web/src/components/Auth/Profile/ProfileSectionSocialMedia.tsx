"use client"

import {
  FormProvider,
  getFieldsetProps,
  getFormProps,
  useField,
} from "@conform-to/react"
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import type { Variants } from "motion/react"
import { AnimatePresence, motion } from "motion/react"
import { useMemo } from "react"
import Icon from "~/components/Icon"
import { updateProfile } from "~/features/auth/actions"
import { userQueryOptions } from "~/features/auth/shared"
import type { IconName } from "~/lib/icons"
import { useFormMutation } from "~/lib/mutations"
import { UpdateProfileFormSchema } from "~/lib/schemas"
import DialogTitle from "../DialogTitle"
import { sectionData } from "./lib"
import ProfileDialogContainer from "./ProfileDialogContainer"

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

  const user = useSuspenseQuery(userQueryOptions)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    async mutationFn(formData: FormData) {
      return updateProfile(formData)
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: userQueryOptions.queryKey,
      })
    },
  })

  const [form, fields] = useFormMutation({
    mutation,
    schema: UpdateProfileFormSchema,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: user.data,
  })

  const fieldList = useMemo(() => fields.links.getFieldList(), [fields.links])

  return (
    <ProfileDialogContainer id="social-media">
      <DialogTitle sm="inter" className="pb-4 md:pb-6">
        {section.label}
      </DialogTitle>
      <form
        {...getFormProps(form)}
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
          if (event.target.value !== event.target.defaultValue) {
            event.currentTarget.requestSubmit()
          }
        }}
      >
        <FormProvider context={form.context}>
          <fieldset {...getFieldsetProps(fields.links)}>
            <legend className="px-3 pb-1 md:px-3.5">Links</legend>
            {array.map((_, index) => {
              const name = `${fields.links.name}[${index}]`

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
                    defaultValue={fieldList[index]?.initialValue}
                    className="block h-10 w-full rounded-3 bg-not-so-white pl-3.5 pr-10 text-gunpla-white-700 caret-gunpla-white-700 transition-shadow placeholder:text-gunpla-white-300"
                    placeholder="https://example.com/user"
                  />
                  {/* <SocialMediaIcon /> */}
                </div>
              )
            })}
          </fieldset>
        </FormProvider>
      </form>
    </ProfileDialogContainer>
  )
}
