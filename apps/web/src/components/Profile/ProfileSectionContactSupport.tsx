import { sectionData } from "./lib"
import ProfileContainer from "./ProfileContainer"
import ProfileTitle from "./ProfileTitle"

export default function ProfileSectionContactSupport() {
  const section = sectionData["contact-support"]

  return (
    <ProfileContainer section="contact-support">
      <ProfileTitle className="pb-6">{section.label}</ProfileTitle>
      <div className="aspect-square bg-acrylic-red-500"></div>
    </ProfileContainer>
  )
}
