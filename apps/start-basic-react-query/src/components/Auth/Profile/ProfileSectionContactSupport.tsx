import { useMutation } from "@tanstack/react-query"
import { FormProvider, useForm } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { Field } from "@ark-ui/react/field"
import { ContactSupportFormSchema } from "~/lib/schemas"
import FieldLength from "~/components/FieldLength"
import Button from "~/components/Button"
import Icon from "~/components/Icon"
import ProfileTitle from "../DialogTitle"
import { sectionData } from "./lib"
import ProfileDialogContainer from "./ProfileDialogContainer"

function ContactSupportForm() {
  const loginMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("contact support", formData)
    },
  })

  const [form, fields] = useForm({
    constraint: getZodConstraint(ContactSupportFormSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: ContactSupportFormSchema,
      })
    },
    async onSubmit(event, context) {
      event.preventDefault()
      await loginMutation.mutateAsync(context.formData)
    },
  })

  return (
    <form
      method="post"
      id={form.id}
      onSubmit={form.onSubmit}
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
            className="h-[9.25rem] w-full resize-none scroll-py-2.5 rounded-4 bg-not-so-white px-3.5 py-2.5 placeholder:text-gunpla-white-300"
          />
        </Field.Root>
        <div className="pointer-events-none absolute bottom-0 right-0">
          <Button type="submit" icon className="pointer-events-auto">
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
      <ProfileTitle className="pb-6">{section.label}</ProfileTitle>
      <ContactSupportForm />
    </ProfileDialogContainer>
  )
}
