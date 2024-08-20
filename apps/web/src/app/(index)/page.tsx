import { saveData } from "~/lib/headers/server"
import * as AspectRatio from "~/components/AspectRatio"
import Container from "~/components/Container"
import Lottie from "~/components/Lottie"

export default function Page() {
  return (
    <>
      <Container grid asChild>
        <header>
          <div className="col-span-2 col-start-2 p-7 sm:col-start-4 sm:px-0 sm:py-16">
            <AspectRatio.Root ratio={2 / 1}>
              <AspectRatio.Content>
                <h1 className="sr-only">Artists Together</h1>
                {saveData() ? (
                  <div>static at logo</div>
                ) : (
                  <Lottie
                    src={() => import("~/assets/lottie/logo-w.json")}
                    autoplay
                  />
                )}
              </AspectRatio.Content>
            </AspectRatio.Root>
          </div>
        </header>
      </Container>
    </>
  )
}
