"use client"

import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import type { ComponentProps, ComponentRef, ForwardedRef } from "react"
import { forwardRef } from "react"
import { getUserOrThrow } from "~/services/auth/client"
import Switch from "~/components/Form/Switch"
import Tooltip from "~/components/Form/Tooltip"
import ModalContainer from "../ModalContainer"
import ModalTitle from "../ModalTitle"
import { updateSchema } from "~/services/auth/shared"
import { update } from "~/services/auth/actions"
import { useFormState } from "react-dom"

type Props = ComponentProps<typeof ModalContainer>

function ProfileAdvancedSettings(
  props: Props,
  ref: ForwardedRef<ComponentRef<typeof ModalContainer>>,
) {
  const user = getUserOrThrow()
  const [lastResult, action] = useFormState(update, undefined)
  const [form, field] = useForm({
    lastResult,
    defaultValue: user,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: updateSchema })
    },
  })

  return (
    <ModalContainer {...props} ref={ref}>
      <ModalTitle>Advanced settings</ModalTitle>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
        className="grid gap-2"
        noValidate
      >
        <Switch name={field.settingsFullHourFormat.name}>
          24-hour time format
        </Switch>
        <Switch name={field.settingsShareLocation.name}>
          <Tooltip>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
            incidunt quaerat. Obcaecati sapiente delectus veritatis non
            reprehenderit dolore id libero a perspiciatis beatae nobis facere
            nisi, vitae, commodi unde ullam?
          </Tooltip>
          Share approximate location
        </Switch>
        <Switch name={field.settingsShareStreaming.name}>
          <Tooltip>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
            incidunt quaerat. Obcaecati sapiente delectus veritatis non
            reprehenderit dolore id libero a perspiciatis beatae nobis facere
            nisi, vitae, commodi unde ullam?
          </Tooltip>
          Share streaming status
        </Switch>
        <Switch name={field.settingsShareCursor.name}>
          <Tooltip>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
            incidunt quaerat. Obcaecati sapiente delectus veritatis non
            reprehenderit dolore id libero a perspiciatis beatae nobis facere
            nisi, vitae, commodi unde ullam?
          </Tooltip>
          Share cursor location
        </Switch>
        <Switch name={field.settingsFahrenheit.name}>
          Temperature in Fahrenheit
        </Switch>
        <button type="submit">update</button>
      </form>
    </ModalContainer>
  )
}

export default forwardRef(ProfileAdvancedSettings)
