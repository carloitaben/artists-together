// "use client"

// import { User } from "lucia"

// import { useForm, withAction, PropsWithAction } from "~/hooks/form"
// import { patchUser } from "~/actions/private"
// import { patchUserSchema } from "~/actions/schemas"
// import { useToast } from "~/components/Toast"
// import * as Modal from "~/components/Modal"
// import * as Form from "~/components/Form"
// import { useCallback } from "react"

// type Props = PropsWithAction<
//   typeof patchUser,
//   {
//     user: User
//   }
// >

// function SectionAdvancedSettings({ action, user }: Props) {
//   const emit = useToast()

//   const { root, field, submit } = useForm({
//     action,
//     schema: patchUserSchema,
//     onError: () => {
//       emit("Oops! Something went wrong")
//     },
//     onSubmit: (data, input) => {
//       console.log("onsubmit", data, input)
//     },
//   })

//   return (
//     <Modal.Container>
//       <Modal.Title>Advanced settings</Modal.Title>
//       <Form.Root {...root()}>
//         <Form.Field
//           {...field("settingShareLocation")}
//           className="mb-2 flex items-center justify-between"
//           onChange={submit}
//         >
//           <Form.Label margin={false}>Share approximate location</Form.Label>
//           <Form.Switch />
//         </Form.Field>
//         <Form.Field
//           {...field("settingShareLive")}
//           className="mb-2 flex items-center justify-between"
//           onChange={submit}
//         >
//           <Form.Label margin={false}>Share streaming status</Form.Label>
//           <Form.Switch />
//         </Form.Field>
//         <Form.Field
//           {...field("settingShareCursor")}
//           className="flex items-center justify-between"
//           onChange={submit}
//         >
//           <Form.Label margin={false}>Share cursor location</Form.Label>
//           <Form.Switch />
//         </Form.Field>
//       </Form.Root>
//     </Modal.Container>
//   )
// }

// export default withAction(SectionAdvancedSettings, patchUser)
