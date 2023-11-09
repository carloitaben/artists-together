import type { ActionFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { validationError } from "remix-validated-form"
import { z } from "zod"
import { zfd } from "zod-form-data"
import type { GlobalDatabaseUserAttributes } from "lucia"
import { auth } from "~/server/auth.server"
import { makeRemoteAsset } from "~/server/files.server"

export const validatorSchema = z.object({
  bio: zfd.text(z.string().max(128).nullable().default(null)),
  settings: z.object({
    use24HourFormat: zfd.checkbox(),
    shareLocation: zfd.checkbox(),
    shareStreaming: zfd.checkbox(),
    shareCursor: zfd.checkbox(),
    fahrenheit: zfd.checkbox(),
  }),
  avatar: zfd.text(z.string().url().nullable().default(null)),
  links: zfd.repeatable(
    z.array(zfd.text(z.string().url().nullable().default(null))).max(5),
  ),
})

export async function action({ request }: ActionFunctionArgs) {
  const authRequest = await auth.handleRequest(request).validate()

  if (!authRequest) {
    return json(null, {
      status: 400,
    })
  }

  const data = await request.formData()

  let attributes: Partial<GlobalDatabaseUserAttributes> = {}

  switch (data.get("subaction")?.toString()) {
    case "profile":
      {
        const form = await withZod(
          validatorSchema.pick({ avatar: true, bio: true }),
        ).validate(data)

        if (form.error) {
          return validationError(form.error)
        }

        if (form.data.avatar) {
          const asset = await makeRemoteAsset(form.data.avatar)
          // TODO: persist this in db as JSON with Asset type
        }

        attributes = form.data
      }
      break
    case "settings":
      {
        const form = await withZod(
          validatorSchema.pick({ settings: true }),
        ).validate(data)

        if (form.error) {
          return validationError(form.error)
        }

        attributes = {
          settings_use_24_hour_format: form.data.settings.use24HourFormat,
          settings_share_location: form.data.settings.shareLocation,
          settings_share_streaming: form.data.settings.shareStreaming,
          settings_share_cursor: form.data.settings.shareCursor,
          settings_fahrenheit: form.data.settings.fahrenheit,
        }
      }
      break
    default:
      return json(null, {
        status: 400,
        statusText: "Missing Subaction",
      })
  }

  console.log("updating user attributes", attributes)

  try {
    await auth.updateUserAttributes(authRequest.user.userId, attributes)
    return json(null, {
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return json(error, {
      status: 502,
    })
  }
}
