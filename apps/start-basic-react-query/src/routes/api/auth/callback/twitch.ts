import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'

export const Route = createAPIFileRoute('/api/auth/callback/twitch')({
  GET: ({ request, params }) => {
    return json({ message: 'Hello /api/auth/callback/twitch' })
  },
})
