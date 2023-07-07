"use client"

import { ComponentProps, ForwardedRef, forwardRef } from "react"
import { TargetAndTransition, motion } from "framer-motion"
import { useFormikContext } from "formik"

import Shiny from "~/components/Shiny"
import Icon from "~/components/Icon"
import { check } from "~/components/Icons"

type Props = ComponentProps<"div"> & {
  children?: string
}

const whileTap: TargetAndTransition = {
  scale: 0.95,
}

function Submit(
  { children, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const { submitForm, isSubmitting, isValid } = useFormikContext()

  return (
    <div {...props}>
      {children ? (
        <Shiny>
          <motion.button
            type="submit"
            className="rounded-full bg-gunpla-white-50 px-10 py-3 text-center font-sans text-sm text-gunpla-white-500 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)] disabled:bg-gunpla-white-100 disabled:text-gunpla-white-400"
            ref={ref}
            onClick={submitForm}
            disabled={isSubmitting || !isValid}
            whileTap={whileTap}
          >
            {children}
          </motion.button>
        </Shiny>
      ) : (
        <Shiny>
          <motion.button
            type="submit"
            className="h-12 w-12 rounded-full bg-gunpla-white-50 p-3 text-gunpla-white-500 shadow-[0px_4px_16px_0px_rgba(11,14,30,0.08)] disabled:bg-gunpla-white-100 disabled:text-gunpla-white-400"
            ref={ref}
            onClick={submitForm}
            disabled={isSubmitting || !isValid}
            whileTap={whileTap}
          >
            <Icon label="Submit">{check}</Icon>
          </motion.button>
        </Shiny>
      )}
    </div>
  )
}

export default forwardRef(Submit)
