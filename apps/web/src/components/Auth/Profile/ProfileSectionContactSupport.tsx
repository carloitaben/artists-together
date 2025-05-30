// "use client"

// import {
//   FormProvider,
//   getFormProps,
//   getInputProps,
//   getTextareaProps,
// } from "@conform-to/react"
// import { useMutation } from "@tanstack/react-query"
// import Button from "~/components/Button"
// import FieldLength from "~/components/FieldLength"
// import Icon from "~/components/Icon"
// import { toaster } from "~/components/Toasts"
// import { contactSupport } from "~/features/contact/actions"
// import { useFormMutation } from "~/lib/mutations"
// import { ContactSupportFormSchema } from "~/lib/schemas"
// import ProfileTitle from "../DialogTitle"
// import { sectionData } from "./lib"
// import ProfileDialogContainer from "./ProfileDialogContainer"

// export default function ProfileSectionContactSupport() {
//   const section = sectionData["contact-support"]

//   const mutation = useMutation({
//     async mutationFn(formData: FormData) {
//       return contactSupport(formData)
//     },
//     onSuccess() {
//       toaster.create({
//         type: "neutral",
//         title: "Your message has been sent",
//       })
//     },
//   })

//   const [form, fields] = useFormMutation({
//     mutation,
//     schema: ContactSupportFormSchema,
//     shouldValidate: "onBlur",
//     shouldRevalidate: "onInput",
//   })
//   return (
//     <ProfileDialogContainer id="contact-support">
//       <ProfileTitle sm="inter" className="pb-4 md:pb-6">
//         {section.label}
//       </ProfileTitle>
//       <form {...getFormProps(form)} className="space-y-2">
//         <FormProvider context={form.context}>
//           <div>
//             <label htmlFor={fields.subject.id} className="px-3 pb-1 md:px-3.5">
//               Subject
//             </label>
//             <input
//               {...getInputProps(fields.subject, { type: "text" })}
//               className="block h-10 w-full rounded-4 bg-not-so-white px-3 text-gunpla-white-700 caret-gunpla-white-700 placeholder:text-gunpla-white-300 md:px-3.5"
//               placeholder="Your subject"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor={fields.message.id}
//               className="flex items-center justify-between px-3 pb-1 md:px-3.5"
//             >
//               Message
//               <FieldLength
//                 className="text-right"
//                 name={fields.message.name}
//                 max={300}
//               />
//             </label>
//             <textarea
//               {...getTextareaProps(fields.message)}
//               placeholder="Your message"
//               className="h-[9.25rem] w-full resize-none scroll-py-2.5 rounded-4 bg-not-so-white px-3 py-2.5 scrollbar-none placeholder:text-gunpla-white-300 md:px-3.5"
//             />
//           </div>
//           <div className="pointer-events-none absolute bottom-0 right-0">
//             <Button
//               type="submit"
//               icon
//               className="pointer-events-auto"
//               disabled={mutation.isPending}
//             >
//               <Icon src="Check" alt="Submit" />
//             </Button>
//           </div>
//         </FormProvider>
//       </form>
//     </ProfileDialogContainer>
//   )
// }
