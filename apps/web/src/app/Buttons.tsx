"use client"

import { useRouter } from "next/navigation"

export default function Buttons() {
  const router = useRouter()

  async function login() {
    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "carloitaben",
      }),
    })
      .then(console.log)
      .catch(console.error)
      .finally(router.refresh)
  }

  async function logout() {
    fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(console.log)
      .catch(console.error)
      .finally(router.refresh)
  }

  return (
    <>
      <button onClick={() => login()}>Log in</button>
      <button onClick={() => logout()}>Log out</button>
    </>
  )
}
