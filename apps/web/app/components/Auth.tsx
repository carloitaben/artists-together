import * as Dialog from "@radix-ui/react-dialog"
import { useFetcher } from "@remix-run/react"

export default function Auth() {
  const signupFetcher = useFetcher()
  const loginFetcher = useFetcher()
  const magicFetcher = useFetcher()

  return (
    <Dialog.Root>
      <Dialog.Trigger>log in or sign up</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: "rgba(0,0,0,0.5)",
          }}
        />
        <Dialog.Content
          style={{
            position: "fixed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <div style={{ background: "white" }}>
            <Dialog.Title>Login or sign up</Dialog.Title>
            <div>
              <strong>log in</strong>
              <loginFetcher.Form action="/login" method="post">
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  defaultValue="hola.carlodominguez@gmail.com"
                  required
                />
                <button>log in</button>
              </loginFetcher.Form>
            </div>
            <div>
              <strong>sign up</strong>
              <signupFetcher.Form action="/login" method="post">
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  defaultValue="hola.carlodominguez@gmail.com"
                  required
                />
                <input type="text" name="username" placeholder="username" required />
                <button>sign up</button>
              </signupFetcher.Form>
            </div>
            <div>
              <strong>validate code</strong>
              <magicFetcher.Form action="/magic" method="post">
                <input
                  type="text"
                  name="email"
                  placeholder="email"
                  required
                  hidden
                  defaultValue="hola.carlodominguez@gmail.com"
                />
                <input type="text" name="otp" placeholder="otp" required />
                <button>validate</button>
              </magicFetcher.Form>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
