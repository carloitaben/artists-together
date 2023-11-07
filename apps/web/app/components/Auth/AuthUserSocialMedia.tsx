import { withZod } from "@remix-validated-form/with-zod"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { motion, AnimatePresence } from "framer-motion"
import { useUserOrThrow } from "~/hooks/loaders"
import * as Modal from "~/components/Modal"
import * as Form from "~/components/Form"
import Icon from "~/components/Icon"

function DyamicLinkIcon({ children = "" }: { children?: string }) {
  let icon: string | undefined

  if (children.includes("instagram")) {
    icon = "instagram"
  } else if (children.includes("twitter")) {
    icon = "home"
  } else if (children.includes("youtube")) {
    icon = "face"
  } else if (children.includes("youtu.be")) {
    icon = "help"
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      {icon ? (
        <motion.div
          key={icon}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute inset-y-0 right-0 pointer-events-none w-10 h-10 flex items-center justify-center"
        >
          <Icon name={icon} label="" className="w-3.5 h-3.5" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function UserLink() {
  return (
    <Form.Field name="links" asChild>
      <li className="relative">
        <Form.Input
          className="w-full"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://example.com/user"
        />
        <Form.Value<string>>
          {(value) => <DyamicLinkIcon>{value}</DyamicLinkIcon>}
        </Form.Value>
        <Form.Error />
      </li>
    </Form.Field>
  )
}

const validator = withZod(
  z.object({
    links: zfd.repeatable(
      z.array(zfd.text(z.string().url().optional())).max(5),
    ),
  }),
)

const fields = Array(5).fill(0)

export default function AuthUserSocialMedia() {
  const user = useUserOrThrow()

  // console.log(user)

  return (
    <Modal.Container>
      <Modal.Heading>Social media</Modal.Heading>
      <Form.Root validator={validator} navigate={false} action="/api/user">
        <h6>Links</h6>
        <ul className="space-y-2">
          {fields.map((_, index) => (
            <UserLink key={index} />
          ))}
        </ul>
      </Form.Root>
    </Modal.Container>
  )
}
