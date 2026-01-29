import Anthropic from '@anthropic-ai/sdk'

let clientInstance: Anthropic | null = null
let lastApiKey: string | null = null

function getClient(apiKey: string): Anthropic {
  if (clientInstance && lastApiKey === apiKey) {
    return clientInstance
  }
  clientInstance = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  })
  lastApiKey = apiKey
  return clientInstance
}

export async function streamRefinement(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string,
  onChunk: (text: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: Error) => void,
): Promise<void> {
  const client = getClient(apiKey)

  try {
    const stream = client.messages.stream({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    let accumulated = ''

    stream.on('text', (text) => {
      accumulated += text
      onChunk(text)
    })

    await stream.finalMessage()
    onComplete(accumulated)
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      onError(new Error('Invalid API key. Please check your key in Settings.'))
    } else if (error instanceof Anthropic.RateLimitError) {
      onError(new Error('Rate limited. Please wait a moment and try again.'))
    } else if (error instanceof Anthropic.APIConnectionError) {
      onError(new Error('Network error. Check your internet connection.'))
    } else if (error instanceof Error) {
      onError(error)
    } else {
      onError(new Error(String(error)))
    }
  }
}
