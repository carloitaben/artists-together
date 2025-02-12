"use client"

import {
  FormProvider,
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react"
import { parseWithValibot } from "conform-to-valibot"
import { useActionState, useEffect } from "react"
import { contactSupport } from "~/lib/actions"
import { useFormToastError } from "~/lib/forms"
import { ContactSupportFormSchema } from "~/lib/schemas"
import FieldLength from "~/components/FieldLength"
import Button from "~/components/Button"
import Icon from "~/components/Icon"
import ProfileTitle from "../DialogTitle"
import ProfileDialogContainer from "./ProfileDialogContainer"
import { sectionData } from "./lib"
import { toaster } from "~/components/Toasts"

function ContactSupportForm() {
  const [lastResult, action, isPending] = useActionState(contactSupport, null)

  useFormToastError(lastResult)

  useEffect(() => {
    if (lastResult && "message" in lastResult) {
      toaster.create({
        type: "success",
        title: lastResult.message,
      })
    }
  }, [lastResult])

  const [form, fields] = useForm({
    lastResult: lastResult?.result,
    onValidate(context) {
      return parseWithValibot(context.formData, {
        schema: ContactSupportFormSchema,
      })
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  })

  return (
    <form {...getFormProps(form)} action={action} className="space-y-2">
      <FormProvider context={form.context}>
        <div>
          <label htmlFor={fields.subject.id} className="px-3 pb-1 md:px-3.5">
            Subject
          </label>
          <input
            {...getInputProps(fields.subject, { type: "text" })}
            className="block h-10 w-full rounded-4 bg-not-so-white px-3 text-gunpla-white-700 caret-gunpla-white-700 placeholder:text-gunpla-white-300 md:px-3.5"
            placeholder="Your subject"
          />
        </div>
        <div>
          <label
            htmlFor={fields.message.id}
            className="flex items-center justify-between px-3 pb-1 md:px-3.5"
          >
            Message
            <FieldLength
              className="text-right"
              name={fields.message.name}
              max={300}
            />
          </label>
          <textarea
            {...getTextareaProps(fields.message)}
            placeholder="Your message"
            className="h-[9.25rem] w-full resize-none scroll-py-2.5 rounded-4 bg-not-so-white px-3 py-2.5 scrollbar-none placeholder:text-gunpla-white-300 md:px-3.5"
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0">
          <Button
            type="submit"
            icon
            className="pointer-events-auto"
            disabled={isPending}
          >
            <Icon src="Check" alt="Submit" />
          </Button>
        </div>
      </FormProvider>
    </form>
  )
}

export default function ProfileSectionContactSupport() {
  const section = sectionData["contact-support"]

  return (
    <ProfileDialogContainer id="contact-support">
      <ProfileTitle sm="inter" className="pb-4 md:pb-6">
        {section.label}
      </ProfileTitle>
      <ContactSupportForm />
    </ProfileDialogContainer>
  )
}
