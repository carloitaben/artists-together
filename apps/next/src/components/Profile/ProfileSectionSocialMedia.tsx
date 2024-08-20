import { Field, Fieldset } from "@ark-ui/react"
import ProfileContainer from "./ProfileContainer"
import ProfileTitle from "./ProfileTitle"
import { sectionData } from "./lib"

const array = Array.from(Array(5))

export default function ProfileSectionSocialMedia() {
  const section = sectionData["social-media"]

  return (
    <ProfileContainer section="social-media">
      <ProfileTitle className="pb-6">{section.label}</ProfileTitle>
      <form>
        <Fieldset.Root>
          <Fieldset.Legend className="px-3.5 pb-1">Links</Fieldset.Legend>
          {array.map((_, index) => (
            <Field.Root key={index} className="pb-2 last-of-type:pb-0">
              <Field.Label className="sr-only">
                Socia media link {index + 1}
              </Field.Label>
              <Field.Input
                className="block h-10 w-full rounded-4 bg-not-so-white px-3.5 text-gunpla-white-700 caret-gunpla-white-700 placeholder:text-gunpla-white-300"
                placeholder="https://example.com/user"
              />
            </Field.Root>
          ))}
        </Fieldset.Root>
      </form>
    </ProfileContainer>
  )
}
