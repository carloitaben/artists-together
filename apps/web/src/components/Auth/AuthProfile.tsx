import { Dialog } from "@ark-ui/react"
import {
  forwardRef,
  type ComponentProps,
  type ComponentRef,
  type ForwardedRef,
} from "react"
import ModalContainer from "./ModalContainer"
import ModalTitle from "./ModalTitle"
import type { User } from "@artists-together/auth"
import AuthProfileConnections from "./Profile/ProfileProfileConnections"
import AuthProfileContentShared from "./Profile/ProfileProfileContentShared"
import ModalLabel from "./ModalLabel"
import Tooltip from "../Form/Tooltip"
import FileUpload from "../FileUpload"

type Props = ComponentProps<typeof ModalContainer> & {
  user: User
}

function AuthProfile(
  { user, ...props }: Props,
  ref: ForwardedRef<ComponentRef<typeof ModalContainer>>,
) {
  return (
    <ModalContainer {...props} ref={ref}>
      <Dialog.Title className="sr-only">Your profile</Dialog.Title>
      <ModalTitle>{user.username}</ModalTitle>
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
            <textarea className="resize-none scroll-px-3 scroll-py-2.5 rounded-2xl bg-not-so-white px-3 py-2.5 text-gunpla-white-700 placeholder-gunpla-white-300 caret-gunpla-white-500" />
          </label>
        </form>
      </div>
      <AuthProfileConnections user={user} />
      <AuthProfileContentShared />
    </ModalContainer>
  )
}

export default forwardRef(AuthProfile)
