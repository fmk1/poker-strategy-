import { useState } from 'react'
import { shouldPush } from '../utils/tournamentCalcs'
import { Card, RANKS, SUITS, Rank, Suit, getHandStrength, getHandDescription } from '../utils/pokerTypes'

const POSITIONS = ['BTN', 'CO', 'MP', 'UTG', 'SB', 'BB']

export default function PushFoldCalculator() {
  const [stackBB, setStackBB] = useState<number>(10)
  const [position, setPosition] = useState<string>('BTN')
  const [card1, setCard1] = useState<Card | null>(null)
  const [card2, setCard2] = useState<Card | null>(null)
  
  // Calculate hand strength from selected cards
  const handStrength = card1 && card2 ? getHandStrength(card1, card2) : 0.5
  const handDesc = card1 && card2 ? getHandDescription(card1, card2) : ''

  const shouldPushResult = shouldPush(stackBB, position, handStrength)

  const handleCard1RankChange = (rank: string) => {
    if (rank && card1?.suit) {
      setCard1({ rank: rank as Rank, suit: card1.suit })
    } else if (rank) {
      setCard1({ rank: rank as Rank, suit: '♠' })
    } else {
      setCard1(null)
    }
  }

  const handleCard1SuitChange = (suit: string) => {
    if (suit && card1?.rank) {
      setCard1({ rank: card1.rank, suit: suit as Suit })
    } else if (suit) {
      setCard1({ rank: 'A', suit: suit as Suit })
    } else {
      setCard1(null)
    }
  }

  const handleCard2RankChange = (rank: string) => {
    if (rank && card2?.suit) {
      setCard2({ rank: rank as Rank, suit: card2.suit })
    } else if (rank) {
      setCard2({ rank: rank as Rank, suit: '♠' })
    } else {
      setCard2(null)
    }
  }

  const handleCard2SuitChange = (suit: string) => {
    if (suit && card2?.rank) {
      setCard2({ rank: card2.rank, suit: suit as Suit })
    } else if (suit) {
      setCard2({ rank: 'A', suit: suit as Suit })
    } else {
      setCard2(null)
    }
  }

  return (
    <div>
      <h2>Push/Fold Calculator</h2>
      <p>Calculate Nash equilibrium push/fold ranges for short stack play</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '900px', margin: '2rem auto' }}>
        <div className="input-group">
          <label>Stack Size (Big Blinds)</label>
          <input
            type="number"
            value={stackBB}
            onChange={(e) => setStackBB(Number(e.target.value))}
            min="1"
            max="20"
          />
        </div>

        <div className="input-group">
          <label>Position</label>
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            {POSITIONS.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
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

      <div className="recommendation" style={{ marginTop: '2rem' }}>
        <h3>Push/Fold Decision</h3>
        {card1 && card2 ? (
          <>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              color: '#4ecdc4'
            }}>
              Hand: {handDesc}
            </div>
            <div className={`recommendation-action ${shouldPushResult ? 'raise' : 'fold'}`}>
              {shouldPushResult ? 'PUSH (All-In)' : 'FOLD'}
            </div>
            <div className="recommendation-details">
              <p>
                With {stackBB} BB from {position}, {handDesc} {shouldPushResult ? 'is' : 'is not'} strong enough to push all-in according to Nash equilibrium.
              </p>
              <h4>Key Points:</h4>
              <ul>
                <li>Stack size: {stackBB} BB - {stackBB < 10 ? 'Critical (push/fold only)' : 'Short stack territory'}</li>
                <li>Position: {position} - {['BTN', 'CO'].includes(position) ? 'Late (wider range)' : 'Early (tighter range)'}</li>
                <li>Hand: {handDesc} - Strength: {(handStrength * 100).toFixed(0)}%</li>
                {stackBB < 8 && <li>⚠️ Very short - need to find spots soon or you'll blind out</li>}
                {shouldPushResult && <li>✅ This hand has enough equity when called</li>}
                {!shouldPushResult && <li>❌ Wait for a stronger hand from this position</li>}
              </ul>
            </div>
          </>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
            <p>Select both cards to see push/fold recommendation</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
        <h4>Push/Fold Guidelines</h4>
        <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <li><strong>20+ BB:</strong> Don't use push/fold - play standard poker</li>
          <li><strong>13-20 BB:</strong> Mix of standard raises and shoves</li>
          <li><strong>8-12 BB:</strong> Mostly push/fold, some min-raises</li>
          <li><strong>&lt;8 BB:</strong> Pure push/fold strategy</li>
          <li><strong>Late position:</strong> Can push wider (more hands)</li>
          <li><strong>Early position:</strong> Need stronger hands to push</li>
        </ul>
      </div>
    </div>
  )
}
