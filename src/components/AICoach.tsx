import { useState } from 'react'
import { DeepSeekService, getApiKey, hasApiKey } from '../utils/deepseekService'

export default function AICoach() {
  const [question, setQuestion] = useState<string>('')
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const isConfigured = hasApiKey()

  const handleAsk = async () => {
    if (!question.trim() || !isConfigured) return

    const apiKey = getApiKey()
    if (!apiKey) {
      setError('API key not found. Please configure it in Settings.')
      return
    }

    setLoading(true)
    setError('')

    // Add user message to conversation
    const userMessage = { role: 'user' as const, content: question }
    setConversation(prev => [...prev, userMessage])
    setQuestion('')

    try {
      const service = new DeepSeekService(apiKey)
      const response = await service.askPokerQuestion(question)
      
      // Add AI response to conversation
      setConversation(prev => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setConversation([])
    setError('')
  }

  const quickQuestions = [
    "What's the optimal push/fold range from the button with 10 BB?",
    "How should I adjust my strategy on the bubble?",
    "What hands should I defend from the big blind?",
    "Explain ICM pressure in simple terms",
    "When should I use a min-raise vs a 3x raise?",
  ]

  if (!isConfigured) {
    return (
      <div>
        <h2>AI Poker Coach</h2>
        <div className="recommendation" style={{ marginTop: '2rem' }}>
          <h3>⚠️ API Key Required</h3>
          <p>
            Please configure your DeepSeek API key in the Settings tab to use the AI Poker Coach.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>🤖 AI Poker Coach</h2>
      <p>Ask me anything about poker tournament strategy!</p>

      <div style={{ marginTop: '2rem' }}>
        {conversation.length === 0 && (
          <div className="recommendation">
            <h3>Quick Questions</h3>
            <p style={{ marginBottom: '1rem' }}>Try asking:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuestion(q)}
                  style={{
                    textAlign: 'left',
                    padding: '0.8rem',
                    backgroundColor: '#2a2a2a',
                    fontSize: '0.9rem'
                  }}
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ 
          maxHeight: '500px', 
          overflowY: 'auto',
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px'
        }}>
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: msg.role === 'user' ? '#2a4a7c' : '#2a2a2a',
                borderRadius: '8px',
                borderLeft: `4px solid ${msg.role === 'user' ? '#646cff' : '#4ecdc4'}`
              }}
            >
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '0.5rem',
                color: msg.role === 'user' ? '#646cff' : '#4ecdc4'
              }}>
                {msg.role === 'user' ? '👤 You' : '🤖 AI Coach'}
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              borderLeft: '4px solid #4ecdc4'
            }}>
              <div style={{ fontWeight: 'bold', color: '#4ecdc4', marginBottom: '0.5rem' }}>
                🤖 AI Coach
              </div>
              <div>Thinking...</div>
            </div>
          )}
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            ❌ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div className="input-group" style={{ flex: 1, margin: 0 }}>
            <label>Your Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleAsk()
                }
              }}
              placeholder="Ask about poker strategy, ICM, hand ranges, etc..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #444',
                backgroundColor: '#2a2a2a',
                color: 'white',
                fontSize: '1rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: '#28a745',
                fontSize: '1rem',
                minWidth: '100px'
              }}
            >
              {loading ? '...' : 'Ask'}
            </button>
            {conversation.length > 0 && (
              <button
                onClick={handleClear}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  fontSize: '0.9rem'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#999' }}>
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}
