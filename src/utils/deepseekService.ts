import axios from 'axios'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface DeepSeekResponse {
  choices: {
    message: {
      content: string
      role: string
    }
    finish_reason: string
  }[]
}

export class DeepSeekService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async chat(messages: DeepSeekMessage[]): Promise<string> {
    try {
      const response = await axios.post<DeepSeekResponse>(
        DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      )

      return response.data.choices[0].message.content
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid API key. Please check your DeepSeek API key.')
        }
        throw new Error(error.response?.data?.error?.message || 'Failed to get AI response')
      }
      throw new Error('Network error. Please check your connection.')
    }
  }

  async analyzeHand(
    position: string,
    hand: string,
    stackBB: number,
    stage: string,
    actionBefore: string
  ): Promise<string> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `You are an expert poker tournament advisor. Provide concise, actionable advice for tournament poker decisions. Focus on ICM considerations, stack sizes, position, and optimal GTO strategy.`
      },
      {
        role: 'user',
        content: `Analyze this poker tournament hand:
        
Position: ${position}
Hand: ${hand}
Stack: ${stackBB} BB
Tournament Stage: ${stage}
Action Before: ${actionBefore}

Provide a brief analysis with:
1. Recommended action (Fold/Call/Raise)
2. Why this is the optimal play
3. Key strategic considerations
4. Alternative lines if applicable

Keep it concise and practical.`
      }
    ]

    return this.chat(messages)
  }

  async askPokerQuestion(question: string, context?: string): Promise<string> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `You are a professional poker tournament coach. Provide expert advice on tournament poker strategy, ICM, push/fold decisions, and optimal play. Be concise and practical.`
      },
      {
        role: 'user',
        content: context ? `${context}\n\n${question}` : question
      }
    ]

    return this.chat(messages)
  }
}

// Local storage key for API key
const API_KEY_STORAGE = 'deepseek_api_key'

export function saveApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY_STORAGE, apiKey)
}

export function getApiKey(): string | null {
  // First check localStorage (user-configured key)
  const storedKey = localStorage.getItem(API_KEY_STORAGE)
  if (storedKey) return storedKey
  
  // Fallback to environment variable if available
  const envKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (envKey && envKey !== 'your_api_key_here') return envKey
  
  return null
}

export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE)
}

export function hasApiKey(): boolean {
  return !!getApiKey()
}

export function isUsingEnvKey(): boolean {
  const storedKey = localStorage.getItem(API_KEY_STORAGE)
  return !storedKey && !!import.meta.env.VITE_DEEPSEEK_API_KEY
}
