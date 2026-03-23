import type { Message } from '@/types/message'
import { createGroq } from '@ai-sdk/groq'
import { createMCPClient } from '@ai-sdk/mcp'
import { convertToModelMessages, stepCountIs, streamText } from 'ai'
import { GROQ_API_KEY, MCP_URL, VERCEL_AUTOMATION_BYPASS_SECRET } from 'astro:env/server'
import { DEFAULT_MODEL, SYSTEM_PROMPT } from '@/constants/ia-config'

const groq = createGroq({
  apiKey: GROQ_API_KEY,
})

export async function POST({ request }) {
  try {
    const { messages }: { messages: Message[] } = await request.json()

    const mcpClient = await createMCPClient({
      transport: {
        type: 'http',
        url: MCP_URL,
        headers: {
          'x-vercel-protection-bypass': VERCEL_AUTOMATION_BYPASS_SECRET,
        },
      },
    })

    const tools = await mcpClient.tools()

    const result = streamText({
      model: groq(DEFAULT_MODEL),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(40),
    })
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Error in /api/chat', error)

    return new Response(JSON.stringify({
      message: error instanceof Error ? error.message : 'Internal server error',
    }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}
