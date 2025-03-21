"use client"

import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { Dialog } from "@ark-ui/react/dialog"
import { FormProvider, getFormProps, getTextareaProps } from "@conform-to/react"
import { useRouter } from "next/navigation"
import { useUser } from "~/lib/promises"
import { useFormMutation } from "~/lib/mutations"
import { updateProfile } from "~/features/auth/actions"
import { UpdateProfileFormSchema } from "~/lib/schemas"
import Icon from "~/components/Icon"
import FieldLength from "~/components/FieldLength"
import AspectRatio from "~/components/AspectRatio"
import DialogTitle from "../DialogTitle"
import Connections from "./Connections"
import ProfileDialogContainer from "./ProfileDialogContainer"
import { sectionData } from "./lib"

export default function ProfileSectionProfile() {
  const user = useUser()
  const router = useRouter()
  const mutation = useMutation({
    async mutationFn(formData: FormData) {
      console.log("mutating...")
      return updateProfile(formData)
    },
    onSuccess() {
      router.refresh()
    },
  })

  const [form, fields] = useFormMutation({
    mutation,
    schema: UpdateProfileFormSchema,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: user,
  })

  const section = sectionData["profile"]

  return (
    <ProfileDialogContainer id="profile">
      <Dialog.Title asChild>
        <DialogTitle sm="inter" className="md:sr-only">
          {section.label}
        </DialogTitle>
      </Dialog.Title>
      <DialogTitle sm="fraunces" className="md:pt:0 pb-4 pt-3 md:pb-6">
        {user?.username}
      </DialogTitle>
      <form
        {...getFormProps(form)}
        className="flex grid-cols-3 flex-col gap-7 pb-6 md:grid md:gap-3 md:pb-3"
        onBlur={(event) => {
          if (!(event.target instanceof HTMLTextAreaElement)) return
          if (!(event.target.name in fields)) return
          if (event.target.value !== event.target.defaultValue) {
            event.currentTarget.requestSubmit()
          }
        }}
      >
        <FormProvider context={form.context}>
          <div>
            <div className="flex items-center gap-x-2 px-3 pb-1 md:px-3.5">
              Avatar
            </div>
            <AspectRatio.Root ratio={1}>
              <AspectRatio.Content className="overflow-hidden rounded-4 bg-not-so-white">
                {user?.avatar ? (
                  <Image
                    className="size-full object-cover"
                    alt="Your avatar"
                    src={user.avatar}
                    draggable={false}
                    unoptimized
                    fill
                  />
                ) : (
                  <div className="grid size-full place-items-center">
                    <Icon src="Face" alt="Your avatar" className="size-6" />
                  </div>
                )}
              </AspectRatio.Content>
            </AspectRatio.Root>
          </div>
          <div className="col-span-2 flex-col md:flex">
            <label
              htmlFor={fields.bio.id}
              className="flex flex-none items-center justify-between px-3 pb-1 md:px-3.5"
            >
              <span>Description</span>
              <FieldLength
                className="text-right"
                name={fields.bio.name}
                max={128}
              />
            </label>
            <textarea
              {...getTextareaProps(fields.bio)}
              placeholder="Hello! I am a creative person!"
              className="h-24 w-full flex-1 resize-none scroll-py-2.5 rounded-4 bg-not-so-white px-3 py-2.5 scrollbar-none placeholder:text-gunpla-white-300 md:h-auto md:px-3.5"
            />
          </div>
        </FormProvider>
      </form>
      <Connections />
      {/* <Fieldset.Root className="grid grid-cols-3 gap-2">
        <Fieldset.Legend className="flex items-center gap-x-2 px-3 md:px-3.5 pb-1">
          <InlineTooltip tooltip="Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis nobis, magni possimus qui neque soluta sequi, eligendi cum explicabo earum non consequatur in at repellat libero quod tempore enim necessitatibus!">
            Content shared
          </InlineTooltip>
        </Fieldset.Legend>
        {array.map((_, index) => (
          <FileUpload.Root key={index} maxFiles={1}>
            <FileUpload.Label className="sr-only">
              Content shared {index}
            </FileUpload.Label>
            <FileUploader />
          </FileUpload.Root>
        ))}
      </Fieldset.Root> */}
    </ProfileDialogContainer>
  )
}
