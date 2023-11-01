import svgHtml from "virtual:svg-icons-ssr-html"

export default function Icons() {
  return (
    <div
      aria-hidden
      className="sr-only"
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  )
}
