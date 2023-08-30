import type { SetStateAction, Dispatch } from "react"
import { createContext, useContext } from "react"

export function createStateContext<T>() {
  const StateContext = createContext<
    undefined | Readonly<[T, Dispatch<SetStateAction<T>>]>
  >(undefined)

  function useStateContext() {
    const tuple = useContext(StateContext)

    if (tuple === undefined) {
      throw new Error(
        `use${StateContext.displayName} must be used within a ${StateContext.displayName}Provider`,
      )
    }

    return tuple
  }

  return [StateContext, useStateContext] as const
}
