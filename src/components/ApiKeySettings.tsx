import { useState } from 'react'
import { saveApiKey, getApiKey, clearApiKey, hasApiKey, isUsingEnvKey } from '../utils/deepseekService'

interface ApiKeySettingsProps {
  onApiKeyChange?: () => void
}

export default function ApiKeySettings({ onApiKeyChange }: ApiKeySettingsProps) {
  const [apiKey, setApiKey] = useState<string>('')
  const [showKey, setShowKey] = useState<boolean>(false)
  const [isConfigured, setIsConfigured] = useState<boolean>(hasApiKey())
  const [message, setMessage] = useState<string>('')
  const usingEnvKey = isUsingEnvKey()

  const handleSave = () => {
    if (!apiKey.trim()) {
      setMessage('Please enter an API key')
      return
    }

    saveApiKey(apiKey.trim())
    setIsConfigured(true)
    setMessage('API key saved successfully!')
    setApiKey('')
    
    if (onApiKeyChange) {
      onApiKeyChange()
    }

    setTimeout(() => setMessage(''), 3000)
  }

  const handleClear = () => {
    clearApiKey()
    setIsConfigured(false)
    setApiKey('')
    setMessage('API key removed')
    
    if (onApiKeyChange) {
      onApiKeyChange()
    }

    setTimeout(() => setMessage(''), 3000)
  }

  const currentKey = getApiKey()

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>DeepSeek API Settings</h2>
      
      {isConfigured ? (
        <div className="recommendation" style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>✅</span>
            <div>
              <h3 style={{ margin: 0, color: '#28a745' }}>API Key Configured</h3>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                {usingEnvKey ? 'Using API key from environment variable (.env file)' : 'Your DeepSeek API key is active'}
              </p>
            </div>
          </div>
          
          {currentKey && (
            <div className="input-group">
              <label>Current API Key {usingEnvKey && '(from .env file)'}</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={currentKey}
                  readOnly
                  style={{ flex: 1 }}
                />
                <button onClick={() => setShowKey(!showKey)}>
                  {showKey ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          )}

          {!usingEnvKey && (
            <button 
              onClick={handleClear}
              style={{ 
                backgroundColor: '#dc3545',
                marginTop: '1rem'
              }}
            >
              Remove API Key
            </button>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <div className="recommendation">
            <h3>Setup DeepSeek AI Analysis</h3>
            <p>
              Get AI-powered poker analysis and coaching by connecting your DeepSeek API key.
            </p>
            
            <div className="recommendation-details">
              <h4>How to get your API key:</h4>
              <ol style={{ textAlign: 'left', lineHeight: '1.8' }}>
                <li>Visit <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" style={{ color: '#646cff' }}>platform.deepseek.com</a></li>
                <li>Sign up or log in to your account</li>
                <li>Navigate to API Keys section</li>
                <li>Create a new API key</li>
                <li>Copy and paste it below OR add it to your .env file</li>
              </ol>
              
              <h4 style={{ marginTop: '1rem' }}>Alternative: Use .env file</h4>
              <p style={{ textAlign: 'left' }}>
                You can also add your API key to the <code style={{ backgroundColor: '#1a1a1a', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>.env</code> file in the project root:
              </p>
              <pre style={{ 
                textAlign: 'left', 
                backgroundColor: '#1a1a1a', 
                padding: '1rem', 
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '0.9rem'
              }}>
VITE_DEEPSEEK_API_KEY=sk-your-actual-api-key-here
              </pre>
              <p style={{ textAlign: 'left', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Then restart the dev server for changes to take effect.
              </p>
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '2rem' }}>
            <label>DeepSeek API Key</label>
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              style={{ fontFamily: 'monospace' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button onClick={() => setShowKey(!showKey)}>
                {showKey ? 'Hide' : 'Show'} Key
              </button>
            </div>
          </div>

          <button 
            onClick={handleSave}
            style={{ 
              marginTop: '1rem',
              backgroundColor: '#28a745',
              padding: '0.8rem 2rem'
            }}
          >
            Save API Key
          </button>
        </div>
      )}

      {message && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: isConfigured ? '#28a745' : '#ffc107',
          color: 'white',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#2a2a2a', 
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <h4>🔒 Privacy & Security</h4>
        <ul style={{ textAlign: 'left', lineHeight: '1.6', margin: '0.5rem 0' }}>
          <li>Your API key is stored locally in your browser</li>
          <li>It's never sent to any server except DeepSeek's API</li>
          <li>You can remove it anytime</li>
          <li>Keep your API key private - don't share it</li>
        </ul>
      </div>
    </div>
  )
}
