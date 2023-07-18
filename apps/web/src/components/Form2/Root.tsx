import { BaseSyntheticEvent, ForwardedRef, ReactNode, forwardRef } from "react"
import { FormProvider, UseFormReturn } from "react-hook-form"

type Props = UseFormReturn<any> & {
  onSubmit: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>
  children: ReactNode
}

function Root(
  { onSubmit, children, ...props }: Props,
  ref: ForwardedRef<HTMLFormElement>
) {
  return (
    <FormProvider {...props}>
      <form ref={ref} onSubmit={onSubmit}>
        {children}
      </form>
    </FormProvider>
  )
}

export default forwardRef(Root)
