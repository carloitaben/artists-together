import { Dialog } from "@ark-ui/react"
import { SectionId } from "../lib"
import ProfileTab from "./ProfileTab"
import ProfileBanner from "./ProfileBanner"
import ProfileLogout from "./ProfileLogout"
import ProfileAdvancedSettings from "./ProfileAdvancedSettings"
import ProfileSocialMedia from "./ProfileSocialMedia"
import ProfileProfile from "./ProfileProfile"

export default function Profile() {
  return (
    <Dialog.Content>
      <div className="relative flex items-start gap-4">
        <aside className="sticky top-0 grid w-full max-w-[14.375rem] gap-2">
          <ProfileTab href={SectionId.Profile} icon="face">
            profile
          </ProfileTab>
          <ProfileTab href={SectionId.SocialMedia} icon="captive-portal">
            social media
          </ProfileTab>
          <ProfileTab href={SectionId.AdvancedSettings} icon="settings">
            advanced
          </ProfileTab>
          <ProfileTab href={SectionId.ContactSupport} icon="contact-support">
            contact support
          </ProfileTab>
        </aside>
        <div className="w-full max-w-[36rem] flex-1 space-y-4">
          <main className="space-y-2">
            <ProfileBanner />
            <ProfileProfile />
            {/* <AuthProfile id={SectionId.Profile} user={auth.user} /> */}
            <ProfileSocialMedia id={SectionId.SocialMedia} />
            <ProfileAdvancedSettings id={SectionId.AdvancedSettings} />
          </main>
          <footer>
            <ProfileLogout />
          </footer>
        </div>
      </div>
    </Dialog.Content>
  )
}
