import { useField } from "remix-validated-form"

type Props = {
  name: string
  label: string
}

export default function Field({ name, label }: Props) {
  const { error, getInputProps } = useField(name)

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input {...getInputProps({ id: name })} />
      {error && <span>{error}</span>}
    </div>
  )
}
