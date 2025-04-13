import Icon from "~/components/Icon"

export default function ProfileBanner() {
  return (
    <div className="flex items-center gap-4 rounded-6 bg-gunpla-white-500 px-8 py-6 text-gunpla-white-50 shadow-card md:px-12 md:py-10">
      <Icon src="Warn" alt="" className="size-5" />
      <p className="flex-1">
        As a temporary monitoring measure, all Artists Together accounts will be
        managed through Discord.
      </p>
    </div>
  )
}
