import type { FunctionComponent, ReactNode } from "react"
import { Children, isValidElement } from "react"

export function findComponents<T>(
  children: ReactNode,
  component: FunctionComponent<T>,
) {
  const filteredChildren: FunctionComponent<T>[] = []

  const findChildren = (elements: ReactNode): void => {
    Children.forEach(elements, (child) => {
      if (isValidElement(child)) {
        if (child.type === component) {
          filteredChildren.push(child as unknown as FunctionComponent<T>)
        }

        if (child.props.children) {
          findChildren(child.props.children)
        }
      }
    })
  }

  findChildren(Children.toArray(children))

  return filteredChildren
}

export function findComponent<T>(
  children: ReactNode,
  component: FunctionComponent<T>,
) {
  let match: FunctionComponent<T> | undefined

  const findChildren = (elements: ReactNode): void => {
    Children.forEach(elements, (child) => {
      if (isValidElement(child)) {
        if (child.type === component) {
          match = child as unknown as FunctionComponent<T>
        } else if (child.props.children) {
          findChildren(child.props.children)
        }
      }
    })
  }

  findChildren(Children.toArray(children))

  return match
}
