import { cx } from "cva"
import type { Transition, Variants } from "framer-motion"
import { motion } from "framer-motion"
import type {
  ComponentRef,
  Dispatch,
  ForwardedRef,
  SetStateAction,
} from "react"
import { forwardRef } from "react"
import Icon from "~/components/Icon"
import { colors } from "~/../tailwind.config"
import { scalePresenceVariants, spring } from "../lib"

type Props = {
  searchbarFocus: boolean
  setSearchbarFocus: Dispatch<SetStateAction<boolean>>
}

const variants: Variants = {
  ...scalePresenceVariants,
  closed: {
    backgroundColor: colors["arpeggio-black"]["800"],
    color: colors["arpeggio-black"]["50"],
  },
  opened: {
    backgroundColor: colors["arpeggio-black"]["50"],
    color: colors["arpeggio-black"]["800"],
  },
}

const transition: Transition = {
  ...spring,
  backgroundColor: {
    type: "tween",
    duration: 0.2,
  },
  color: {
    type: "tween",
    duration: 0.2,
  },
}

function NavigationBottombarSearch(
  { searchbarFocus, setSearchbarFocus }: Props,
  ref: ForwardedRef<ComponentRef<typeof motion.form>>,
) {
  return (
    <motion.form
      layout
      ref={ref}
      action={(formData) => {
        console.log(formData.get("q")?.toString())
      }}
      onFocus={() => setSearchbarFocus(true)}
      onBlur={() => setSearchbarFocus(false)}
      initial="hide"
      animate={["show", searchbarFocus ? "opened" : "closed"]}
      exit="hide"
      variants={variants}
      transition={transition}
      className={cx(
        searchbarFocus ? "flex-1" : "w-12 flex-none",
        "relative overflow-hidden",
      )}
      style={{
        borderRadius: 16,
        boxShadow: "0px 4px 8px rgba(11, 14, 30, 0.08)",
      }}
    >
      <motion.input
        name="q"
        type="text"
        layout="position"
        placeholder="Search"
        className={cx(
          "size-full min-w-[--min-w] bg-transparent py-4 pl-4 pr-12 caret-gunpla-white-700 placeholder:text-gunpla-white-300 focus:outline-none",
          !searchbarFocus && "cursor-pointer",
        )}
        initial={false}
        onKeyDown={(event) => {
          switch (event.key) {
            case "Escape":
              return event.currentTarget.blur()
            case "Enter":
              event.currentTarget.blur()
              return event.currentTarget.form?.requestSubmit()
          }
        }}
        onFocus={(event) => {
          event.currentTarget.select()
        }}
        animate={{
          opacity: searchbarFocus ? 1 : 0,
          transition: {
            opacity: {
              delay: searchbarFocus ? 0.05 : 0,
            },
          },
        }}
      />
      <motion.div
        layout
        aria-hidden={!searchbarFocus}
        className={cx(
          "absolute inset-y-0 right-0 grid w-12 place-items-center",
          !searchbarFocus && "pointer-events-none",
        )}
      >
        <Icon src="Search" alt="" className="size-6" />
      </motion.div>
    </motion.form>
  )
}

export default forwardRef(NavigationBottombarSearch)