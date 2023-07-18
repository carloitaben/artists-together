import {
  // ChangeEventHandler,
  // KeyboardEventHandler,
  // RefObject,
  useTransition,
} from "react"
import { z, TypeOf } from "zod"
// import { useField, useFormikContext } from "formik"
import { useRouter } from "next/navigation"
// import { cx } from "class-variance-authority"

import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"
import { useToast } from "~/components/Toast"

const schema = z.object({
  otp: z.string().length(6),
})

function Resend({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      className="mt-8 text-center text-sm underline disabled:text-gunpla-white-300 disabled:no-underline"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          })
        })
      }
    >
      Not received? Resend it
    </button>
  )
}

// function OtpInput({ buttonRef }: { buttonRef: RefObject<HTMLButtonElement> }) {
//   const [field, _, helpers] = useField({ name: "otp" })

//   const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
//     if (event.target.value.length >= 6) {
//       helpers.setValue(event.target.value.toUpperCase().slice(0, 6))
//       buttonRef.current?.focus()
//     } else {
//       helpers.setValue(event.target.value.toUpperCase())
//     }
//   }

//   const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
//     if (event.code.startsWith("Arrow")) {
//       event.preventDefault()
//     }
//   }

//   return (
//     <input
//       {...field}
//       onKeyDown={onKeyDown}
//       onChange={onChange}
//       className="absolute inset-0 text-transparent opacity-0"
//     />
//   )
// }

// function OtpDigit({ position }: { position: number }) {
//   const context = useFormikContext<TypeOf<typeof schema>>()
//   const value = context.values.otp.charAt(position)
//   const focus = context.values.otp.length === position

//   return (
//     <div
//       className={cx(
//         "flex h-14 w-10 items-center justify-center rounded-4xl bg-not-so-white text-center font-serif text-[2rem] uppercase text-gunpla-white-700",
//         focus ? "outline" : ""
//       )}
//     >
//       {value}
//     </div>
//   )
// }

type Props = {
  email: string
  onSuccess: (data: TypeOf<typeof schema>) => void
}

export default function Verify({ email, onSuccess }: Props) {
  // const buttonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const emit = useToast()

  // return (
  //   <Form.Root
  //     schema={schema}
  //     initialValues={{ otp: "" }}
  //     onSubmit={async (data, helpers) => {
  //       const response = await fetch("/api/auth/verify", {
  //         method: "POST",
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           otp: data.otp,
  //           email,
  //         }),
  //       })

  //       if (response.ok) {
  //         router.refresh()
  //         modal.setOpen(false)
  //         emit({ title: "Logged in succesfully" })
  //       } else {
  //         alert("oh no")
  //         helpers.resetForm()
  //       }
  //     }}
  //   >
  //     <div className="flex flex-col items-center gap-4">
  //       <div className="relative flex w-[36rem] flex-col items-center justify-center overflow-hidden rounded-4xl bg-gunpla-white-50 pb-12 pt-10 text-gunpla-white-500 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)]">
  //         <Title className="mb-6 text-center text-2xl">
  //           A verification code
  //           <br />
  //           has been sent to your email account
  //         </Title>
  //         <Form.Form>
  //           <div className="relative">
  //             <div
  //               aria-hidden
  //               className="flex items-center justify-center gap-2"
  //             >
  //               <OtpDigit position={0} />
  //               <OtpDigit position={1} />
  //               <OtpDigit position={2} />
  //               <OtpDigit position={3} />
  //               <OtpDigit position={4} />
  //               <OtpDigit position={5} />
  //             </div>
  //             <OtpInput buttonRef={buttonRef} />
  //           </div>
  //         </Form.Form>
  //         <Resend email={email} />
  //         <Form.Loading />
  //       </div>
  //       <Form.Submit ref={buttonRef}>Confirm</Form.Submit>
  //     </div>
  //   </Form.Root>
  // )

  return (
    <Form.Root
      delay
      schema={schema}
      initialValues={{ otp: "" }}
      onSubmit={async (data) => {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: data.otp,
            email,
          }),
        })

        if (!response.ok) {
          const json = await response.json()
          throw Error("error" in json ? json.error : "Unknown error")
        }

        // @ts-expect-error i need to fix this :)
        onSuccess(data)
        emit({ title: "Logged in succesfully" })
        return router.refresh()
      }}
    >
      <Modal.Container className="text-center">
        <Modal.Title className="mb-6 text-center text-2xl">
          A verification code
          <br />
          has been sent to your email account
        </Modal.Title>
        <Form.Field name="otp">
          <Form.Label>otp plz</Form.Label>
          <Form.Input />
          <Form.Error />
        </Form.Field>
        <Resend email={email} />
        <Form.Loading />
      </Modal.Container>
      <Form.Submit className="mt-4 flex justify-center">Confirm</Form.Submit>
    </Form.Root>
  )
}
