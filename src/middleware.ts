import { defineMiddleware } from 'astro:middleware'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const RATE_LIMIT_REQUESTS = 5 // 5 requests per minute
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor)
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown'

  return request.headers.get('x-real-ip') ?? 'unknown'
}

function isApiRoute(pathname: string) {
  return pathname.startsWith('/api/')
}

function applyRateLimit(key: string, now: number) {
  const current = rateLimitStore.get(key)
  if (!current || now > current.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT_REQUESTS - 1, resetAt: now + RATE_LIMIT_WINDOW_MS }
  }

  if (current.count >= RATE_LIMIT_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  rateLimitStore.set(key, current)
  return { allowed: true, remaining: RATE_LIMIT_REQUESTS - current.count, resetAt: current.resetAt }
}

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  if (!isApiRoute(url.pathname))
    return next()

  const now = Date.now()
  const ip = getClientIp(request)
  const rateLimitKey = `${ip}:${url.pathname}`
  const result = applyRateLimit(rateLimitKey, now)

  if (!result.allowed) {
    const retryAfterSeconds = Math.ceil((result.resetAt - now) / 1000)
    return new Response(JSON.stringify({ message: 'Too many requests' }), {
      status: 429,
      headers: {
        'content-type': 'application/json',
        'retry-after': String(retryAfterSeconds),
      },
    })
  }

  const response = await next()
  response.headers.set('x-ratelimit-limit', String(RATE_LIMIT_REQUESTS))
  response.headers.set('x-ratelimit-remaining', String(result.remaining))
  response.headers.set('x-ratelimit-reset', String(Math.floor(result.resetAt / 1000)))
  return response
})
