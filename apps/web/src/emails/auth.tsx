import {
  Tailwind,
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

import tailwindConfig from "../../tailwind.config"

type OtpEmailProps = {
  otp: string
}

export function OtpEmail({ otp }: OtpEmailProps) {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Preview>Your login code</Preview>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-0 w-[560px] px-0 pb-12 pt-5">
            <Heading className="text-[24px] text-black">
              Your login code
            </Heading>
            <Section className="py-7">
              <Button
                pY={11}
                pX={23}
                className="block rounded bg-[#5e6ad2] text-center font-semibold text-white"
                href="https://linear.app"
              >
                Login
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              This link and code will only be valid for the next 5 minutes. If
              the link does not work, you can use the login verification code
              directly:
            </Text>
            <code className="font-mono rounded-md bg-[#dfe1e4] px-px py-1 text-[21px] font-bold text-[#3c4149]">
              {otp}
            </code>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}
