import { useState } from 'react'
import './App.css'
import HandAnalyzer from './components/HandAnalyzer'
import PushFoldCalculator from './components/PushFoldCalculator'
import ICMCalculator from './components/ICMCalculator'
import TournamentTracker from './components/TournamentTracker'
import AICoach from './components/AICoach'
import ApiKeySettings from './components/ApiKeySettings'

type Tab = 'analyzer' | 'pushfold' | 'icm' | 'tracker' | 'aicoach' | 'settings'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('analyzer')

  const handleApiKeyChange = () => {
    // Force re-render when API key changes
    setActiveTab(prev => prev)
  }

  return (
    <div className="app">
      <header>
        <h1>🃏 Poker Tournament Analyzer</h1>
        <nav>
          <button 
            className={activeTab === 'analyzer' ? 'active' : ''} 
            onClick={() => setActiveTab('analyzer')}
          >
            Hand Analyzer
          </button>
          <button 
            className={activeTab === 'pushfold' ? 'active' : ''} 
            onClick={() => setActiveTab('pushfold')}
          >
            Push/Fold
          </button>
          <button 
            className={activeTab === 'icm' ? 'active' : ''} 
            onClick={() => setActiveTab('icm')}
          >
            ICM Calculator
          </button>
          <button 
            className={activeTab === 'tracker' ? 'active' : ''} 
            onClick={() => setActiveTab('tracker')}
          >
            Tournament Tracker
          </button>
          <button 
            className={activeTab === 'aicoach' ? 'active' : ''} 
            onClick={() => setActiveTab('aicoach')}
            style={{ backgroundColor: activeTab === 'aicoach' ? '#4ecdc4' : '#2a2a2a' }}
          >
            🤖 AI Coach
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'analyzer' && <HandAnalyzer />}
        {activeTab === 'pushfold' && <PushFoldCalculator />}
        {activeTab === 'icm' && <ICMCalculator />}
        {activeTab === 'tracker' && <TournamentTracker />}
        {activeTab === 'aicoach' && <AICoach />}
        {activeTab === 'settings' && <ApiKeySettings onApiKeyChange={handleApiKeyChange} />}
      </main>
    </div>
  )
}

export default App
