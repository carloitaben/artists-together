import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Component,
  staticData: {
    label: "Home",
  },
})

function Component() {
  // return (
  //   <>
  //     <Container asChild>
  //       <Grid asChild>
  //         <header>
  //           <div className="col-span-2 col-start-2 p-7 sm:col-start-4 sm:px-0 sm:py-16">
  //             <AspectRatio.Root ratio={2 / 1}>
  //               <AspectRatio.Content>
  //                 <h1 className="sr-only">Artists Together</h1>
  //                 {saveData ? (
  //                   <div>static at logo</div>
  //                 ) : (
  //                   <Lottie
  //                     src={() => import("~/assets/lottie/logo-w.json")}
  //                     autoplay
  //                   />
  //                 )}
  //               </AspectRatio.Content>
  //             </AspectRatio.Root>
  //           </div>
  //         </header>
  //       </Grid>
  //     </Container>
  //     <Container asChild>
  //       <main>
  //         <Grid className="scale:-mb-36">
  //           <WidgetInstagram />
  //           <VerticalSpheresStackShape />
  //           <WidgetLive />
  //         </Grid>
  //         <Grid className="scale:-mb-48">
  //           <div className="col-span-2 scale:mt-40">
  //             <WidgetCalendar />
  //           </div>
  //           <ScribbleShape />
  //           <WidgetClock />
  //           <WidgetSlideshow />
  //         </Grid>
  //         <Grid className="scale:-mb-32">
  //           <WidgetWeather />
  //         </Grid>
  //         <Grid className="items-end">
  //           <VerticalRoundedRectanglesStackShape />
  //           <HorizontalSpheresStackShape />
  //           <VerticalOvalStackShape />
  //           <SquareShape />
  //         </Grid>
  //       </main>
  //     </Container>
  //   </>
  // )
  return (
    <div>
      <div>home</div>
    </div>
  )
}
