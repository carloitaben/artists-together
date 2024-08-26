import { Dialog } from "@ark-ui/react"
import { sections } from "./lib"
import ProfileBanner from "./ProfileBanner"
import ProfileTab from "./ProfileTab"
import ProfileSectionProfile from "./ProfileSectionProfile"
import ProfileSectionSocialMedia from "./ProfileSectionSocialMedia"
import ProfileSectionAdvancedSettings from "./ProfileSectionAdvancedSettings"
import ProfileSectionContactSupport from "./ProfileSectionContactSupport"
import ProfileLogout from "./ProfileLogout"

export default function Profile() {
  return (
    <Dialog.Content className="focus:outline-none">
      <div className="relative flex items-start gap-4">
        <aside className="sticky top-0 grid w-full max-w-[14.375rem] gap-2">
          {sections.map((section) => (
            <ProfileTab key={section} section={section} />
          ))}
        </aside>
        <div className="w-full max-w-[36rem] flex-1 space-y-4">
          <main className="space-y-2">
            <ProfileBanner />
            <ProfileSectionProfile />
            <ProfileSectionSocialMedia />
            <ProfileSectionAdvancedSettings />
            <ProfileSectionContactSupport />
          </main>
          <footer>
            <ProfileLogout />
          </footer>
        </div>
      </div>
    </Dialog.Content>
  )
}
