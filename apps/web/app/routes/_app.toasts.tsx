import Button from "~/components/Button"
import { emit } from "~/components/Toasts"

export const handle = {
  actions: {},
  page: {
    name: "Toasts",
  },
}

export default function Page() {
  return (
    <main className="flex h-full items-center justify-center gap-2">
      <Button onClick={() => emit.message(Math.random().toString(32).slice(2))}>
        Emit toast
      </Button>
      <Button
        onClick={() =>
          emit.message(Math.random().toString(32).slice(2), { duration: 10000 })
        }
      >
        Emit toast with custom duration
      </Button>
      <Button onClick={() => emit.error()}>Emit error toast</Button>
    </main>
  )
}
