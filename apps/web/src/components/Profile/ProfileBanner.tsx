import Icon from "~/components/Icon"

export default function ProfileBanner() {
  return (
    <div className="flex items-center gap-4 rounded-6 bg-gunpla-white-500 px-12 py-10 text-gunpla-white-50 shadow-card">
      <Icon src="Warn" alt="" className="size-5" />
      <p className="flex-1">
        As a temporary monitoring measure, all Artists Together accounts must
        have joined our Discord server to unlock all features.
      </p>
    </div>
  )
}
