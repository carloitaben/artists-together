import DialogContainer from "../DialogContainer"
import ProfileTitle from "../DialogTitle"
import { sectionData } from "./lib"

export default function ProfileSectionContactSupport() {
  const section = sectionData["contact-support"]

  return (
    <DialogContainer id="contact-support">
      <ProfileTitle className="pb-6">{section.label}</ProfileTitle>
      <div className="aspect-square bg-acrylic-red-500"></div>
    </DialogContainer>
  )
}
