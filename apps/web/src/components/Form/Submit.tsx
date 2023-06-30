import { ComponentProps, ForwardedRef, forwardRef } from "react"
import { cx } from "class-variance-authority"

import Icon from "~/components/Icon"
import { check } from "~/components/Icons"
import { useFormikContext } from "formik"

type Props = ComponentProps<"div"> & {
  children?: string
}

function Submit(
  { children, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const { submitForm, isSubmitting } = useFormikContext()

  return (
    <div {...props}>
      {children ? (
        <button
          type="submit"
          className="rounded-full bg-gunpla-white-50 px-10 py-3 text-center font-sans text-sm text-gunpla-white-500 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)] disabled:text-gunpla-white-300"
          ref={ref}
          onClick={submitForm}
          disabled={isSubmitting}
        >
          {children}
        </button>
      ) : (
        <button
          type="submit"
          className="h-12 w-12 rounded-full bg-gunpla-white-50 p-3 text-gunpla-white-500 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)]"
          ref={ref}
          onClick={submitForm}
          disabled={isSubmitting}
        >
          <Icon label="Submit">{check}</Icon>
        </button>
      )}
    </div>
  )
}

export default forwardRef(Submit)
