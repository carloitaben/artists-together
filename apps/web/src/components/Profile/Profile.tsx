import type { DialogTriggerProps } from "@radix-ui/react-dialog"

import { getSession } from "~/services/auth"
import { profile } from "~/components/Icons"
import * as Modal from "~/components/Modal"

import SectionProfile from "./SectionProfile"
import SectionSocialMedia from "./SectionSocialMedia"
// import SectionAdvancedSettings from "./SectionAdvancedSettings"
import SectionContactSupport from "./SectionContactSupport"
import Logout from "./Logout"
import Icon from "../Icon"
import { caution } from "../Icons"

type Props = DialogTriggerProps

export default async function Profile({ children, ...props }: Props) {
  const session = await getSession()

  if (!session?.user) return null

  return (
    <Modal.Root>
      <Modal.Trigger {...props}>{children}</Modal.Trigger>
      <Modal.Portal kind="tabs">
        <Modal.Tabs>
          <Modal.Tab icon={profile} value="profile">
            Profile
          </Modal.Tab>
          <Modal.Tab icon={profile} value="social-media">
            Social media
          </Modal.Tab>
          <Modal.Tab icon={profile} value="advanced-settings">
            Advanced settings
          </Modal.Tab>
          <Modal.Tab icon={profile} value="contact-support">
            Contact support
          </Modal.Tab>
        </Modal.Tabs>
        <Modal.Content value="profile">
          <Modal.Container
            background={false}
            py={false}
            className="mb-2 flex items-center gap-4 rounded-4xl bg-gunpla-white-500 px-12 py-9 text-sm text-gunpla-white-50 shadow-card"
          >
            <Icon label="" className="h-4 flex-none">
              {caution}
            </Icon>
            <p>
              As a temporary monitoring measure, all Artists Together accounts
              must have joined our Discord server to unlock all features.
            </p>
          </Modal.Container>
          <SectionProfile user={session.user} />
        </Modal.Content>
        <Modal.Content value="social-media">
          <SectionSocialMedia user={session.user} />
        </Modal.Content>
        <Modal.Content value="advanced-settings">
          {/* <SectionAdvancedSettings user={session.user} /> */}
        </Modal.Content>
        <Modal.Content value="contact-support">
          <SectionContactSupport user={session.user} />
        </Modal.Content>
        <div>
          <Logout />
        </div>
      </Modal.Portal>
    </Modal.Root>
  )
}