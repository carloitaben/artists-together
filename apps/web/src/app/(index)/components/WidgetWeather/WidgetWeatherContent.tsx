"use client"

import Image from "next/image"
import { use } from "react"
import { useHints, useUser } from "~/lib/promises"
import type { getRandomLocationWithWeather } from "~/services/locations/server"

type Props = {
  promise: ReturnType<typeof getRandomLocationWithWeather>
}

function celsiusToFahrenheit(celsius: number) {
  return (celsius * 9) / 5 + 32
}

export default function WidgetWeatherContent({ promise }: Props) {
  const data = use(promise)
  const user = useUser()
  const hints = useHints()

  const unit =
    user?.settings?.fahrenheit || hints.temperatureUnit === "fahrenheit"
      ? "F"
      : "C"

  function formatTemp(celsius: number) {
    return Math.round(unit === "C" ? celsius : celsiusToFahrenheit(celsius))
  }

  return (
    <div className="flex size-full items-center justify-between font-fraunces font-light text-anamorphic-teal-700 [background:radial-gradient(484.75%_388.20%_at_76.54%_43.27%,#F4F4F4_0%,#50D5FF_100%)] scale:text-[2rem]/[2.375rem]">
      <div className="h-full scale:pb-[2.375rem] scale:pl-12 scale:pt-[2.625rem]">
        <h6 className="scale:mb-5">{`${data.location.city}, ${data.location.country}`}</h6>
        <span>
          Today <span className="font-fraunces-ampersand">&</span> Tomorrow
        </span>
        <div className="scale:text-[4rem]/[4rem]">
          {`${formatTemp(data.weathers.todayMin)}/${formatTemp(data.weathers.todayMax)} º${unit}`}
        </div>
        <div className="flex items-center scale:gap-5 scale:text-[4rem]/[4rem]">
          <Image
            src={data.weathers.tomorrowWeatherCode.src}
            alt={data.weathers.tomorrowWeatherCode.label}
            width={200}
            height={200}
            className="object-contain drop-shadow-card scale:mt-1 scale:h-10 scale:w-10"
          />
          <span>
            {`${formatTemp(data.weathers.tomorrowMin)}/${formatTemp(data.weathers.tomorrowMax)} º${unit}`}
          </span>
        </div>
      </div>
      <div className="relative flex-none scale:mr-12 scale:size-[12.5rem]">
        <Image
          src={data.weathers.todayWeatherCode.src}
          alt={data.weathers.todayWeatherCode.label}
          className="size-full object-contain drop-shadow-card"
          fill
        />
      </div>
    </div>
  )
}
