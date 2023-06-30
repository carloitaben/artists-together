import { ComponentProps } from "react"

import Icon from "~/components/Icon"
import { check } from "~/components/Icons"

type Props = ComponentProps<"div"> & {
  children?: string
}

export default function Submit({ children, className, ...props }: Props) {
  return (
    <div {...props} className={`${className} flex justify-end`}>
      {children ? (
        <button
          type="submit"
          className="rounded-full bg-gunpla-white-50 px-10 py-3 text-center font-sans text-sm text-gunpla-white-500 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)] disabled:text-gunpla-white-300"
        >
          {children}
        </button>
      ) : (
        <button
          type="submit"
          className="h-12 w-12 rounded-full bg-gunpla-white-50 p-3 text-gunpla-white-500 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)]"
        >
          <Icon label="Submit">{check}</Icon>
        </button>
      )}
    </div>
  )
}
