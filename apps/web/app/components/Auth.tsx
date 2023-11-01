import * as Dialog from "@radix-ui/react-dialog"
import * as Form from "~/components/Form"
import { useUser } from "~/hooks/loaders"
import { validator as logoutValidator } from "~/routes/auth.logout"
import { validator as authValidator } from "~/routes/auth"

export default function Auth() {
  const user = useUser()

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 flex items-center justify-center bg-theme-900/25 backdrop-blur-xl">
        <Dialog.Content className="max-w-xl w-full bg-gunpla-white-50 text-gunpla-white-500 rounded-4xl py-10 px-16">
          {user ? (
            <>
              <Dialog.Title>Your profile</Dialog.Title>
              <Dialog.Description>:)</Dialog.Description>
              <pre>{JSON.stringify(user, null, 2)}</pre>
              <Form.Root
                validator={logoutValidator}
                action="/auth/logout"
                navigate={false}
              >
                <Form.Debugger />
                <Form.Submit className="disabled:opacity-25">
                  Log out
                </Form.Submit>
              </Form.Root>
            </>
          ) : (
            <>
              <Dialog.Title>Welcome</Dialog.Title>
              <Dialog.Description>Login plz</Dialog.Description>
              <Form.Root validator={authValidator} action="/auth">
                <Form.Debugger />
                <Form.Submit className="bg-[#5865F2] rounded-full text-gunpla-white-50 p-5 inline-flex">
                  Log-in with Discord
                </Form.Submit>
              </Form.Root>
            </>
          )}
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  )
}
