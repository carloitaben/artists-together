import * as Tabs from "@radix-ui/react-tabs"
import { useFetcher } from "@remix-run/react"
import { $path } from "remix-routes"
import type { ReactNode } from "react"

import * as Modal from "./Modal"
import Icon from "./Icon"
import { profile, register } from "./Icons"

type Props = {
  className?: string
  children: ReactNode
}

export default function AuthModal({ className, children }: Props) {
  const signupFetcher = useFetcher()
  const loginFetcher = useFetcher()
  const magicFetcher = useFetcher()

  // return (
  //   <Modal.Root>
  //     <Modal.Trigger className={className}>{children}</Modal.Trigger>
  //     <Modal.Portal>
  //       <Overlay />
  //       <Modal.Content
  //         style={{
  //           position: "fixed",
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //           top: 0,
  //           right: 0,
  //           bottom: 0,
  //           left: 0,
  //         }}
  //       >
  //         <div style={{ background: "white" }}>
  //           <Modal.Title>Login or sign up</Modal.Title>
  //           <div>
  //             <strong>log in</strong>
  //             <loginFetcher.Form action="/login" method="post">
  //               <input
  //                 type="email"
  //                 name="email"
  //                 placeholder="email"
  //                 defaultValue="hola.carlodominguez@gmail.com"
  //                 required
  //               />
  //               <button>log in</button>
  //             </loginFetcher.Form>
  //           </div>
  //           <div>
  //             <strong>sign up</strong>
  //             <signupFetcher.Form action="/login" method="post">
  //               <input
  //                 type="email"
  //                 name="email"
  //                 placeholder="email"
  //                 defaultValue="hola.carlodominguez@gmail.com"
  //                 required
  //               />
  //               <input type="text" name="username" placeholder="username" required />
  //               <button>sign up</button>
  //             </signupFetcher.Form>
  //           </div>
  //           <div>
  //             <strong>validate code</strong>
  //             <magicFetcher.Form action="/magic" method="post">
  //               <input
  //                 type="text"
  //                 name="email"
  //                 placeholder="email"
  //                 required
  //                 hidden
  //                 defaultValue="hola.carlodominguez@gmail.com"
  //               />
  //               <input type="text" name="otp" placeholder="otp" required />
  //               <button>validate</button>
  //             </magicFetcher.Form>
  //           </div>
  //         </div>
  //       </Modal.Content>
  //     </Modal.Portal>
  //   </Modal.Root>
  // )

  return (
    <Modal.Root>
      <Modal.Trigger>{children}</Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay />
        <Modal.Content className="fixed inset-0">
          <Tabs.Root orientation="vertical" defaultValue="login">
            <Tabs.List aria-label="Log in or register" className="flex flex-col gap-2 w-56">
              <Tabs.Trigger
                value="login"
                className="h-12 bg-gunpla-white-50 text-gunpla-white-500 rounded-full flex items-center p-3.5 gap-3"
              >
                <Icon className="w-5 h-5" label="Log-in">
                  {profile}
                </Icon>
                <span>Log in</span>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="register"
                className="h-12 bg-gunpla-white-50 text-gunpla-white-500 rounded-full flex items-center p-3.5 gap-3"
              >
                <Icon className="w-5 h-5" label="Register">
                  {register}
                </Icon>
                <span>Register</span>
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="login">
              <loginFetcher.Form
                action={$path("/login")}
                method="post"
                replace
                className="w-[36rem] flex flex-col gap-4"
              >
                <div className=" bg-gunpla-white-50 rounded-[2rem] p-12">
                  <Modal.Title className="text-[2rem] font-light font-serif">Login</Modal.Title>
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    defaultValue="hola.carlodominguez@gmail.com"
                    required
                  />
                </div>
                <button>log in</button>
              </loginFetcher.Form>
            </Tabs.Content>
            <Tabs.Content value="register">
              <signupFetcher.Form
                action={$path("/register")}
                method="post"
                replace
                className="w-[36rem] flex flex-col gap-4"
              >
                <div className=" bg-gunpla-white-50 rounded-[2rem] p-12">
                  <Modal.Title className="text-[2rem] font-light font-serif">Register</Modal.Title>
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    defaultValue="hola.carlodominguez@gmail.com"
                    required
                  />
                  <input type="text" name="username" placeholder="username" required />
                </div>
                <button>Register</button>
              </signupFetcher.Form>
            </Tabs.Content>
          </Tabs.Root>
        </Modal.Content>
      </Modal.Portal>
    </Modal.Root>
  )
}
