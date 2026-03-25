import type { createGroq } from '@ai-sdk/groq'

export type GroqModel = Parameters<ReturnType<typeof createGroq>>[0]
