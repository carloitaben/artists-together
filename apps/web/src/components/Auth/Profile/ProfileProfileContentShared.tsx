import FileUpload from "~/components/FileUpload"
import Tooltip from "../../Form/Tooltip"

export default function ProfileProfileContentShared() {
  return (
    <div>
      <label>
        <Tooltip>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
          nesciunt dignissimos, minima vitae numquam harum facere ab, dolorum
          quos assumenda culpa, praesentium reiciendis rem ipsa fuga quasi
          eveniet sequi officia.
        </Tooltip>
        Content shared
      </label>
      <div className="grid grid-cols-3 gap-2">
        <FileUpload />
        <FileUpload />
        <FileUpload />
      </div>
    </div>
  )
}
