"use client"

import { emit } from "~/components/Toast"

export default function Page() {
  return (
    <div>
      <button
        onClick={() =>
          emit({
            type: "info",
            title: Math.random().toString(),
          })
        }
      >
        emit info toast
      </button>
      <button onClick={() => emit({ type: "error", title: "Liada" })}>
        emit error toast
      </button>
    </div>
  )
}
