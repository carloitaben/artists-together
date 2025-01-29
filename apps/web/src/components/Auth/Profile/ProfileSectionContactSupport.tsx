"use client"

import { Field } from "@ark-ui/react/field"
import { FormProvider, useForm } from "@conform-to/react"
import { parseWithValibot } from "conform-to-valibot"
import { useActionState } from "react"
import { contactSupport } from "~/lib/actions"
import { useHydrated } from "~/lib/react"
import { useFormToastError } from "~/lib/forms"
import { ContactSupportFormSchema } from "~/lib/schemas"
import FieldLength from "~/components/FieldLength"
import Button from "~/components/Button"
import Icon from "~/components/Icon"
import ProfileTitle from "../DialogTitle"
import ProfileDialogContainer from "./ProfileDialogContainer"
import { sectionData } from "./lib"

function ContactSupportForm() {
  const [lastResult, action, isPending] = useActionState(contactSupport, null)
  const hydrated = useHydrated()

  useFormToastError(lastResult)

  const [form, fields] = useForm({
    lastResult,
    onValidate(context) {
      return parseWithValibot(context.formData, {
        schema: ContactSupportFormSchema,
      })
    },
  })

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      noValidate={hydrated}
      className="space-y-2"
    >
      <FormProvider context={form.context}>
        <Field.Root
          required={fields.subject.required}
          invalid={Boolean(fields.subject.errors?.length)}
        >
          <Field.Label className="px-3.5 pb-1">Subject</Field.Label>
          <Field.Input
            name={fields.subject.name}
            className="block h-10 w-full rounded-4 bg-not-so-white px-3.5 text-gunpla-white-700 caret-gunpla-white-700 placeholder:text-gunpla-white-300"
            placeholder="Your subject"
          />
        </Field.Root>
        <Field.Root
          required={fields.message.required}
          invalid={Boolean(fields.message.errors?.length)}
        >
          <Field.Label className="flex items-center justify-between px-3.5 pb-1">
            <span>Message</span>
            <FieldLength
              className="text-right"
              name={fields.message.name}
              max={300}
            />
          </Field.Label>
          <Field.Textarea
            name={fields.message.name}
            placeholder="Your message"
            className="h-[9.25rem] w-full resize-none scroll-py-2.5 rounded-4 bg-not-so-white px-3.5 py-2.5 scrollbar-none placeholder:text-gunpla-white-300"
          />
        </Field.Root>
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
      <ProfileTitle sm="inter" className="pb-6">
        {section.label}
      </ProfileTitle>
      <ContactSupportForm />
    </ProfileDialogContainer>
  )
}
