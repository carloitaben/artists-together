import { Dialog } from "@ark-ui/react"
import type { ComponentProps } from "react"
import ModalContainer from "../ModalContainer"
import ModalTitle from "../ModalTitle"
import Tooltip from "~/components/Form/Tooltip"
import FileUpload from "~/components/FileUpload"
import ProfileProfileConnections from "./ProfileProfileConnections"
import ProfileProfileContentShared from "./ProfileProfileContentShared"
import { authenticate } from "~/services/auth/server"

type Props = ComponentProps<typeof ModalContainer>

export default async function ProfileProfile(props: Props) {
  const auth = await authenticate()

  if (!auth) {
    throw Error("Unauthorized")
  }

  return (
    <ModalContainer {...props}>
      <Dialog.Title className="sr-only">Your profile</Dialog.Title>
      <ModalTitle>{auth.user.username}</ModalTitle>
      <div className="flex gap-9">
        <form className="flex-[128]">
          <label>
            <div>
              <Tooltip>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Reprehenderit facere sed tenetur exercitationem nihil. Ad, id
                commodi impedit nulla ea laborum fugit. Cum suscipit dolore odio
                pariatur nihil, numquam consectetur?
              </Tooltip>
              <div>Avatar</div>
            </div>
            <FileUpload className="size-32" />
          </label>
        </form>
        <form>
          <label>
            <div>Description</div>
            <textarea className="bg-not-so-white text-gunpla-white-700 placeholder-gunpla-white-300 caret-gunpla-white-500 resize-none scroll-px-3 scroll-py-2.5 rounded-2xl px-3 py-2.5" />
          </label>
        </form>
      </div>
      <ProfileProfileConnections />
      <ProfileProfileContentShared />
    </ModalContainer>
  )
}
