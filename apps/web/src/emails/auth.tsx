import {
  Tailwind,
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

import config from "../../tailwind.config"

export function OtpEmail({ otp }: { otp: string }) {
  return (
    <Tailwind config={config}>
      <Html>
        <Head />
        <Preview>Your login code</Preview>
        <Body className="bg-not-so-white font-sans">
          <Container className="mx-auto my-0 w-[560px] px-0 pb-12 pt-5">
            <Heading className="text-[24px] text-black">
              Your login code
            </Heading>
            <Section className="py-7">
              <Text className="text-[14px] leading-[24px] text-black">
                This code will only be valid for the next 5 minutes.
              </Text>
              <code className="font-mono rounded-md bg-[#dfe1e4] px-px py-1 text-[21px] font-bold text-[#3c4149]">
                {otp}
              </code>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}
