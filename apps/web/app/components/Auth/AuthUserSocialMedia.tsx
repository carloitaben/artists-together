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
    <div className="absolute inset-y-0 right-0 pointer-events-none">
      <AnimatePresence initial={false} mode="wait">
        {icon ? (
          <motion.div
            key={icon}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Icon name={icon} label="" className="w-3.5 h-3.5" />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function UserLink() {
  return (
    <Form.Field name="link" asChild>
      <li className="relative">
        <Form.Input
          className="w-full"
          type="text"
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

export default function AuthUserSocialMedia() {
  const user = useUserOrThrow()

  return (
    <Modal.Container>
      <Modal.Title>Social media</Modal.Title>
      <Form.Root>
        <h6>Links</h6>
        <ul className="space-y-2">
          <UserLink />
          <UserLink />
          <UserLink />
          <UserLink />
          <UserLink />
        </ul>
      </Form.Root>
    </Modal.Container>
  )
}
