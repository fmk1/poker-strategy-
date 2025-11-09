import { useState } from 'react'
import { Card, RANKS, SUITS, Position, TournamentStage, Rank, Suit, getHandDescription } from '../utils/pokerTypes'
import { analyzeHand } from '../utils/handAnalyzer'
import { DeepSeekService, getApiKey, hasApiKey } from '../utils/deepseekService'

const POSITIONS: Position[] = ['UTG', 'UTG+1', 'MP', 'CO', 'BTN', 'SB', 'BB']
const STAGES: TournamentStage[] = ['Early', 'Middle', 'Late', 'Bubble', 'ITM']

export default function HandAnalyzer() {
  const [card1, setCard1] = useState<Card | null>(null)
  const [card2, setCard2] = useState<Card | null>(null)
  const [position, setPosition] = useState<Position>('BTN')
  const [stackBB, setStackBB] = useState<number>(30)
  const [stage, setStage] = useState<TournamentStage>('Middle')
  const [actionBefore, setActionBefore] = useState<string>('Fold')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
  const [loadingAI, setLoadingAI] = useState(false)
  const [aiError, setAiError] = useState<string>('')

  const handleCard1RankChange = (rank: string) => {
    if (rank && card1?.suit) {
      setCard1({ rank: rank as Rank, suit: card1.suit })
    } else if (rank) {
      setCard1({ rank: rank as Rank, suit: '♠' })
    } else {
      setCard1(null)
    }
    setShowAnalysis(false)
    setAiAnalysis('')
  }

  const handleCard1SuitChange = (suit: string) => {
    if (suit && card1?.rank) {
      setCard1({ rank: card1.rank, suit: suit as Suit })
    } else if (suit) {
      setCard1({ rank: 'A', suit: suit as Suit })
    } else {
      setCard1(null)
    }
    setShowAnalysis(false)
    setAiAnalysis('')
  }

  const handleCard2RankChange = (rank: string) => {
    if (rank && card2?.suit) {
      setCard2({ rank: rank as Rank, suit: card2.suit })
    } else if (rank) {
      setCard2({ rank: rank as Rank, suit: '♠' })
    } else {
      setCard2(null)
    }
    setShowAnalysis(false)
    setAiAnalysis('')
  }

  const handleCard2SuitChange = (suit: string) => {
    if (suit && card2?.rank) {
      setCard2({ rank: card2.rank, suit: suit as Suit })
    } else if (suit) {
      setCard2({ rank: 'A', suit: suit as Suit })
    } else {
      setCard2(null)
    }
    setShowAnalysis(false)
    setAiAnalysis('')
  }

  const handleAnalyze = () => {
    if (card1 && card2) {
      setShowAnalysis(true)
      setAiAnalysis('')
      setAiError('')
    }
  }

  const handleAIAnalyze = async () => {
    if (!card1 || !card2) return

    const apiKey = getApiKey()
    if (!apiKey) {
      setAiError('Please configure your DeepSeek API key in Settings')
      return
    }

    setLoadingAI(true)
    setAiError('')

    try {
      const service = new DeepSeekService(apiKey)
      const handDesc = getHandDescription(card1, card2)
      const response = await service.analyzeHand(
        position,
        handDesc,
        stackBB,
        stage,
        actionBefore
      )
      setAiAnalysis(response)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Failed to get AI analysis')
    } finally {
      setLoadingAI(false)
    }
  }

  const analysis = card1 && card2 ? analyzeHand(position, card1, card2, stackBB, stage, actionBefore) : null

  return (
    <div>
      <h2>Hand Analyzer</h2>
      <p>Select your position, stack size, and cards to get optimal play recommendations</p>

      <div className="position-selector">
        <h3>Position</h3>
        <div className="position-grid">
          {POSITIONS.map(pos => (
            <button
              key={pos}
              className={position === pos ? 'selected' : ''}
              onClick={() => setPosition(pos)}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label>Stack Size (Big Blinds)</label>
        <input
          type="number"
          value={stackBB}
          onChange={(e) => setStackBB(Number(e.target.value))}
          min="1"
          max="200"
        />
      </div>

      <div className="input-group">
        <label>Tournament Stage</label>
        <select value={stage} onChange={(e) => setStage(e.target.value as TournamentStage)}>
          {STAGES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label>Action Before You</label>
        <select value={actionBefore} onChange={(e) => setActionBefore(e.target.value)}>
          <option value="Fold">Everyone Folded</option>
          <option value="Raise">Someone Raised</option>
          <option value="Call">Someone Called</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
        <div className="card-selector">
          <h3>First Card</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
            <div className="input-group" style={{ flex: 1, margin: 0 }}>
              <label>Rank</label>
              <select 
                value={card1?.rank || ''} 
                onChange={(e) => handleCard1RankChange(e.target.value)}
                style={{ fontSize: '1.1rem', padding: '0.8rem' }}
              >
                <option value="">Select...</option>
                {RANKS.map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
            </div>
            <div className="input-group" style={{ flex: 1, margin: 0 }}>
              <label>Suit</label>
              <select 
                value={card1?.suit || ''} 
                onChange={(e) => handleCard1SuitChange(e.target.value)}
                style={{ 
                  fontSize: '1.1rem', 
                  padding: '0.8rem',
                  color: card1?.suit === '♥' || card1?.suit === '♦' ? '#ff6b6b' : '#4ecdc4'
                }}
              >
                <option value="">Select...</option>
                {SUITS.map(suit => (
                  <option 
                    key={suit} 
                    value={suit}
                    style={{ color: suit === '♥' || suit === '♦' ? '#ff6b6b' : '#4ecdc4' }}
                  >
                    {suit} {suit === '♠' ? 'Spades' : suit === '♥' ? 'Hearts' : suit === '♦' ? 'Diamonds' : 'Clubs'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {card1 && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: '#2a2a2a', 
              borderRadius: '8px',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: card1.suit === '♥' || card1.suit === '♦' ? '#ff6b6b' : '#4ecdc4'
            }}>
              {card1.rank}{card1.suit}
            </div>
          )}
        </div>

        <div className="card-selector">
          <h3>Second Card</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
            <div className="input-group" style={{ flex: 1, margin: 0 }}>
              <label>Rank</label>
              <select 
                value={card2?.rank || ''} 
                onChange={(e) => handleCard2RankChange(e.target.value)}
                style={{ fontSize: '1.1rem', padding: '0.8rem' }}
              >
                <option value="">Select...</option>
                {RANKS.map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
            </div>
            <div className="input-group" style={{ flex: 1, margin: 0 }}>
              <label>Suit</label>
              <select 
                value={card2?.suit || ''} 
                onChange={(e) => handleCard2SuitChange(e.target.value)}
                style={{ 
                  fontSize: '1.1rem', 
                  padding: '0.8rem',
                  color: card2?.suit === '♥' || card2?.suit === '♦' ? '#ff6b6b' : '#4ecdc4'
                }}
              >
                <option value="">Select...</option>
                {SUITS.map(suit => (
                  <option 
                    key={suit} 
                    value={suit}
                    style={{ color: suit === '♥' || suit === '♦' ? '#ff6b6b' : '#4ecdc4' }}
                  >
                    {suit} {suit === '♠' ? 'Spades' : suit === '♥' ? 'Hearts' : suit === '♦' ? 'Diamonds' : 'Clubs'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {card2 && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: '#2a2a2a', 
              borderRadius: '8px',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: card2.suit === '♥' || card2.suit === '♦' ? '#ff6b6b' : '#4ecdc4'
            }}>
              {card2.rank}{card2.suit}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <button
          onClick={handleAnalyze}
          disabled={!card1 || !card2}
          style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}
        >
          Analyze Hand
        </button>
        
        {hasApiKey() && (
          <button
            onClick={handleAIAnalyze}
            disabled={!card1 || !card2 || loadingAI}
            style={{ 
              padding: '1rem 2rem', 
              fontSize: '1.2rem',
              backgroundColor: '#4ecdc4',
              color: '#1a1a1a'
            }}
          >
            {loadingAI ? '🤖 Analyzing...' : '🤖 AI Analysis'}
          </button>
        )}
      </div>

      {aiError && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#dc3545',
          color: 'white',
          borderRadius: '8px'
        }}>
          ❌ {aiError}
        </div>
      )}

      {aiAnalysis && (
        <div className="recommendation" style={{ marginTop: '2rem', backgroundColor: '#1a4d4d' }}>
          <h3 style={{ color: '#4ecdc4' }}>🤖 AI Analysis</h3>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', marginTop: '1rem' }}>
            {aiAnalysis}
          </div>
        </div>
      )}

      {showAnalysis && analysis && (
        <div className="recommendation">
          <h3>Recommendation</h3>
          <div className={`recommendation-action ${analysis.recommendation.toLowerCase()}`}>
            {analysis.recommendation.toUpperCase()}
          </div>
          <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>{analysis.reasoning}</p>
          <div className="recommendation-details">
            <h4>Details:</h4>
            <ul>
              {analysis.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
