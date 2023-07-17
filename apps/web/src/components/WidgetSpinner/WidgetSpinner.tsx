import { Suspense } from "react"

import WidgetSpinnerContent from "./WidgetSpinnerContent"

function Fallback() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 219 219"
      fill="none"
      className="text-theme-700"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M109.5.977c-4.774 0-9.306 1.877-18.369 5.631L49.733 23.756c-9.063 3.754-13.594 5.631-16.97 9.007-3.376 3.376-5.253 7.907-9.007 16.97L6.61 91.131C2.854 100.194.977 104.726.977 109.5c0 4.774 1.877 9.305 5.632 18.369l17.147 41.397c3.754 9.064 5.631 13.595 9.007 16.971 3.376 3.376 7.907 5.253 16.97 9.007l41.398 17.147c9.063 3.754 13.595 5.631 18.369 5.631 4.774 0 9.306-1.877 18.369-5.631l41.397-17.147c9.064-3.754 13.595-5.631 16.971-9.007 3.376-3.376 5.253-7.907 9.007-16.971l17.147-41.397c3.755-9.063 5.632-13.595 5.632-18.369 0-4.774-1.877-9.306-5.632-18.369l-17.147-41.398c-3.754-9.063-5.631-13.594-9.007-16.97-3.376-3.376-7.907-5.253-16.971-9.007L127.869 6.608C118.806 2.854 114.274.978 109.5.978ZM110 46c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12s-12 5.372-12 12c0 6.627 5.373 12 12 12Z"
      />
    </svg>
  )
}

export default function WidgetTheme() {
  return (
    <div className="col-span-2 sm:col-span-1">
      <Suspense fallback={<Fallback />}>
        <WidgetSpinnerContent />
      </Suspense>
    </div>
  )
}
