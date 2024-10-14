"use client"

import { Dialog } from "@ark-ui/react/dialog"
import { usePathname } from "next/navigation"
import { login } from "~/services/auth/actions"
import Button from "~/components/Button"
import Icon from "~/components/Icon"
import DialogContainer from "./DialogContainer"
import DialogTitle from "./DialogTitle"

export default function Login() {
  const pathname = usePathname()

  return (
    <Dialog.Content className="space-y-4 focus:outline-none">
      <DialogContainer>
        <DialogTitle asChild>
          <Dialog.Title className="max-sm:text-center mb-4 px-3 sm:mb-5">
            Welcome to <br className="sm:hidden" />
            Artists Together
          </Dialog.Title>
        </DialogTitle>
        <Dialog.Description className="px-3.5 text-xs sm:text-base">
          We will be using Discord to manage your Artists Together account.
        </Dialog.Description>
      </DialogContainer>
      <form action={login.bind(null, pathname)} className="flex justify-end">
        <Button
          type="submit"
          color={false}
          className="bg-[#5865F2] text-gunpla-white-50 selection:bg-gunpla-white-50 selection:text-[#5865F2]"
        >
          <Icon
            src="Discord"
            alt=""
            className="flex h-3 w-4 items-center justify-center sm:h-[1.125rem] sm:w-6"
          />
          Log-in with Discord
        </Button>
      </form>
    </Dialog.Content>
  )
}

// ;<Dialog.Content className="space-y-4 focus:outline-none">
//   {/* <ModalContainer>
//         <ModalTitle asChild> */}
//   <Dialog.Title className="max-sm:text-center mb-4 px-3 sm:mb-5">
//     Welcome to <br className="sm:hidden" />
//     Artists Together
//   </Dialog.Title>
//   {/* </ModalTitle> */}
//   <Dialog.Description className="px-3.5 text-xs sm:text-base">
//     We will be using Discord to manage your Artists Together account.
//   </Dialog.Description>
//   {/* </ModalContainer> */}
//   <form action={login.bind(null, pathname)} className="flex justify-end">
//     <Button
//       type="submit"
//       color={false}
//       className="bg-[#5865F2] text-gunpla-white-50 selection:bg-gunpla-white-50 selection:text-[#5865F2]"
//     >
//       <Icon
//         src="Discord"
//         alt=""
//         className="flex h-3 w-4 items-center justify-center sm:h-[1.125rem] sm:w-6"
//       />
//       Log-in with Discord
//     </Button>
//   </form>
// </Dialog.Content>
