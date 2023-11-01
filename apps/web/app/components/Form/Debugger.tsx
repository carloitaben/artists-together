import { useFormContext } from "remix-validated-form"

export default function Debugger() {
  const { isValid, fieldErrors } = useFormContext()

  console.log({ isValid, fieldErrors })

  return null
}
