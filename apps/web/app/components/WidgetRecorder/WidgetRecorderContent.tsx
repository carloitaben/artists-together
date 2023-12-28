import { useCallback, useEffect, useState } from "react"
import { emit } from "~/components/Toasts"
import { useFileUpload } from "~/lib/files"

const MAX_LENGTH_MS = 5_000
const VISUALIZER_COLUMN_LENGTH = 17

export default function WidgetRecorderContent() {
  const { upload } = useFileUpload({ bucket: "public", folder: "recordings" })
  const [recording, setRecording] = useState(false)
  const [blob, setBlob] = useState<Blob>()
  const [media, setMedia] = useState<{
    stream: MediaStream
    recorder: MediaRecorder
  }>()

  useEffect(() => {
    if (!media) return

    if (!recording) {
      return media.recorder.stop()
    }

    media.recorder.start()

    const timeout = setTimeout(() => {
      setRecording(false)
    }, MAX_LENGTH_MS)

    return () => {
      clearTimeout(timeout)
    }
  }, [media, recording])

  useEffect(() => {
    if (!media) return

    let chunks: Blob[] = []

    function onDataAvailable(event: BlobEvent) {
      chunks.push(event.data)
    }

    media.recorder.addEventListener("dataavailable", onDataAvailable, {
      passive: true,
    })

    media.recorder.addEventListener("stop", () => {
      const audioBlob = new Blob(chunks, {
        type: media.recorder.mimeType,
      })

      chunks = []
      setBlob(audioBlob)
      upload({ body: audioBlob, filename: "recording" })
    })

    return () => {
      media.stream.getTracks().forEach((track) => track.stop())
    }
  }, [media, upload])

  const getMediaStream = useCallback(() => {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return emit.error("Oops! Unsupported feature")
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((stream) => {
        const recorder = new MediaRecorder(stream)
        setMedia({ recorder, stream })
        setRecording(true)
      })
      .catch((error) => {
        if (!(error instanceof Error)) {
          return emit.error()
        }

        switch (error.name) {
          case "NotAllowedError":
            return emit.error("Oops! Permission denied")
          case "NotFoundError":
          case "NotReadableError":
          case "OverconstrainedError":
          case "SecurityError":
            return emit.error("Oops! Cannot use microphone")
          default:
            return emit.error()
        }
      })
  }, [])

  const onPress = useCallback(() => {
    if (!media) return getMediaStream()
    setRecording((current) => !current)
  }, [getMediaStream, media])

  return (
    <div className="bg-acrylic-red-50 text-acrylic-red-500 w-full h-full fluid:pt-20">
      <div className="flex items-center justify-center fluid:gap-0.5 flex-1">
        {Array(VISUALIZER_COLUMN_LENGTH)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="fluid:h-24 flex-none fluid:w-2 bg-acrylic-red-500 rounded-full"
            />
          ))}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-acrylic-red-500 text-acrylic-red-50"
        onClick={() => onPress()}
      >
        {recording ? "recording" : "record"}
      </button>
      {blob ? <audio src={URL.createObjectURL(blob)} controls></audio> : null}
    </div>
  )
}
