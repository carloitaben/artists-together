import { Tailwind, Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components"
import tailwindConfig from "../../tailwind.config"

type Props = {
  otp: string
}

export default function OtpEmail({ otp }: Props) {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Preview>Your login code</Preview>
        <Body className="bg-white font-sans">
          <Container className="my-0 mx-auto pt-5 px-0 pb-12 w-[560px]">
            <Heading className="text-black text-[24px]">Your login code</Heading>
            <Section className="py-7">
              <Button
                pY={11}
                pX={23}
                className="bg-[#5e6ad2] rounded font-semibold text-white text-center block"
                href="https://linear.app"
              >
                Login
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              This link and code will only be valid for the next 5 minutes. If the link does not work, you can use the
              login verification code directly:
            </Text>
            <code className="font-mono text-[#3c4149] font-bold px-px py-1 bg-[#dfe1e4] text-[21px] rounded-md">
              {otp}
            </code>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}
