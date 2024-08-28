import { cx } from "cva"
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

type Props = {
  searchbarFocus: boolean
  setSearchbarFocus: Dispatch<SetStateAction<boolean>>
}

function NavigationBottombarSearch(
  { searchbarFocus, setSearchbarFocus }: Props,
  ref: ForwardedRef<ComponentRef<typeof motion.form>>,
) {
  return (
    <motion.form
      layout
      ref={ref}
      onFocus={() => setSearchbarFocus(true)}
      onBlur={() => setSearchbarFocus(false)}
      className={cx(
        searchbarFocus ? "flex-1" : "w-12 flex-none",
        "relative overflow-hidden",
      )}
      initial={{
        opacity: 0,
        scale: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        backgroundColor: searchbarFocus
          ? colors["gunpla-white"]["50"]
          : colors["arpeggio-black"]["800"],
        color: searchbarFocus
          ? colors["arpeggio-black"]["800"]
          : colors["gunpla-white"]["50"],
      }}
      exit={{
        opacity: 0,
        scale: 0,
      }}
      style={{
        borderRadius: 16,
        boxShadow: "0px 4px 8px rgba(11, 14, 30, 0.08)",
      }}
    >
      <motion.input
        layout="position"
        placeholder="Search"
        className={cx(
          "size-full min-w-[--min-w] bg-transparent py-4 pl-4 pr-12 caret-gunpla-white-700 placeholder:text-gunpla-white-300 focus:outline-none",
          !searchbarFocus && "cursor-pointer",
        )}
        initial={false}
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