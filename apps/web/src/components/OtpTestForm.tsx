"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema } from "db"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

const schema = userSchema.pick({ email: true }).extend({
  otp: z.string().length(6),
})

type TestFormSchema = z.infer<typeof schema>

export default function OtpTestForm() {
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const form = useForm<TestFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      otp: "",
    },
  })

  const onSubmit: SubmitHandler<TestFormSchema> = (data) => {
    startTransition(async () => {
      try {
        await fetch("/api/auth/magic", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        form.reset()
        router.refresh()
      } catch (error) {
        form.setError("root", {
          message: error instanceof Error ? error.message : "Unknown error",
        })
      }
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="m-12 bg-gunpla-white-400 p-12"
    >
      <input
        className="input"
        placeholder="email"
        {...form.register("email")}
      />
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}
      <input className="input" placeholder="otp" {...form.register("otp")} />
      {form.formState.errors.otp && (
        <span>{form.formState.errors.otp.message}</span>
      )}
      <button disabled={pending}>{pending ? "loading" : "submit"}</button>
    </form>
  )
}
