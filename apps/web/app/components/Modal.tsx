import * as Dialog from "@radix-ui/react-dialog"

export const Root = Dialog.Root
export const Trigger = Dialog.Trigger
export const Portal = Dialog.Portal
export const Content = Dialog.Content
export const Title = Dialog.Title
export const Description = Dialog.Description
export const Close = Dialog.Close

export function Overlay() {
  return <Dialog.Overlay className="fixed inset-0 backdrop-blur-md bg-arpeggio-black-900/25" />
}
