import { useState } from 'react'
import { calculateMRatio, calculateEffectiveStackBB, calculateBubbleFactor } from '../utils/tournamentCalcs'

export default function TournamentTracker() {
  const [stack, setStack] = useState<number>(15000)
  const [smallBlind, setSmallBlind] = useState<number>(100)
  const [bigBlind, setBigBlind] = useState<number>(200)
  const [ante, setAnte] = useState<number>(25)
  const [players, setPlayers] = useState<number>(9)
  const [currentPosition, setCurrentPosition] = useState<number>(25)
  const [totalPlayers, setTotalPlayers] = useState<number>(180)
  const [paidPlaces, setPaidPlaces] = useState<number>(18)

  const mRatio = calculateMRatio(stack, smallBlind, bigBlind, ante, players)
  const effectiveStack = calculateEffectiveStackBB(stack, bigBlind)
  const bubbleFactor = calculateBubbleFactor(currentPosition, totalPlayers, paidPlaces, effectiveStack)

  const getMStatus = (m: number): { status: string; color: string; advice: string } => {
    if (m > 20) return {
      status: 'Green Zone',
      color: '#28a745',
      advice: 'Comfortable stack - play normal poker with full range of moves'
    }
    if (m > 10) return {
      status: 'Yellow Zone',
      color: '#ffc107',
      advice: 'Tighten up - focus on strong hands and good spots'
    }
    if (m > 6) return {
      status: 'Orange Zone',
      color: '#fd7e14',
      advice: 'Push/fold becoming necessary - look for reshove opportunities'
    }
    if (m > 3) return {
      status: 'Red Zone',
      color: '#dc3545',
      advice: 'Critical - pure push/fold, need to find a spot soon'
    }
    return {
      status: 'Dead Zone',
      color: '#6c757d',
      advice: 'Emergency - push any playable hand immediately'
    }
  }

  const status = getMStatus(mRatio)

  return (
    <div>
      <h2>Tournament Tracker</h2>
      <p>Track your tournament position, stack health, and optimal strategy adjustments</p>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr', marginTop: '2rem' }}>
        <div>
          <h3>Your Stack</h3>
          <div className="input-group">
            <label>Stack Size</label>
            <input
              type="number"
              value={stack}
              onChange={(e) => setStack(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>

        <div>
          <h3>Blind Levels</h3>
          <div className="input-group">
            <label>Small Blind</label>
            <input
              type="number"
              value={smallBlind}
              onChange={(e) => setSmallBlind(Number(e.target.value))}
              min="0"
            />
          </div>
          <div className="input-group">
            <label>Big Blind</label>
            <input
              type="number"
              value={bigBlind}
              onChange={(e) => setBigBlind(Number(e.target.value))}
              min="0"
            />
          </div>
          <div className="input-group">
            <label>Ante</label>
            <input
              type="number"
              value={ante}
              onChange={(e) => setAnte(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Tournament Info</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
          <div className="input-group">
            <label>Players at Table</label>
            <input
              type="number"
              value={players}
              onChange={(e) => setPlayers(Number(e.target.value))}
              min="2"
              max="10"
            />
          </div>
          <div className="input-group">
            <label>Your Position</label>
            <input
              type="number"
              value={currentPosition}
              onChange={(e) => setCurrentPosition(Number(e.target.value))}
              min="1"
            />
          </div>
          <div className="input-group">
            <label>Total Players</label>
            <input
              type="number"
              value={totalPlayers}
              onChange={(e) => setTotalPlayers(Number(e.target.value))}
              min="1"
            />
          </div>
          <div className="input-group">
            <label>Paid Places</label>
            <input
              type="number"
              value={paidPlaces}
              onChange={(e) => setPaidPlaces(Number(e.target.value))}
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="recommendation" style={{ marginTop: '2rem' }}>
        <h3>Stack Analysis</h3>
        
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>M-Ratio</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ecdc4' }}>
              {mRatio.toFixed(1)}
            </div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Stack (BB)</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ecdc4' }}>
              {effectiveStack.toFixed(1)}
            </div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>From Money</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: currentPosition <= paidPlaces ? '#28a745' : '#ffc107' }}>
              {currentPosition <= paidPlaces ? 'ITM ✅' : `${currentPosition - paidPlaces}`}
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: status.color, borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: 'white' }}>{status.status}</h3>
          <p style={{ margin: '0.5rem 0 0 0', color: 'white' }}>{status.advice}</p>
        </div>

        <div className="recommendation-details">
          <h4>Strategy Adjustments:</h4>
          <ul>
            {effectiveStack < 15 && <li>⚠️ Short stack - implement push/fold strategy</li>}
            {effectiveStack >= 15 && effectiveStack < 40 && <li>Medium stack - balance aggression with survival</li>}
            {effectiveStack >= 40 && <li>Deep stack - can play more speculative hands</li>}
            {currentPosition > paidPlaces && currentPosition - paidPlaces <= 3 && (
              <li style={{ color: '#ffc107', fontWeight: 'bold' }}>
                🎯 ON THE BUBBLE - adjust for ICM pressure (factor: {bubbleFactor.toFixed(2)})
              </li>
            )}
            {currentPosition <= paidPlaces && <li style={{ color: '#28a745' }}>✅ In the money - focus on ladder climbing</li>}
            {mRatio < 5 && <li style={{ color: '#dc3545', fontWeight: 'bold' }}>🚨 URGENT - need to double up or bust soon</li>}
          </ul>

          <h4>M-Ratio Zones:</h4>
          <ul>
            <li><strong>Green (M &gt; 20):</strong> Full poker - all moves available</li>
            <li><strong>Yellow (M 10-20):</strong> Careful - avoid marginal spots</li>
            <li><strong>Orange (M 6-10):</strong> Push/fold territory emerging</li>
            <li><strong>Red (M 3-6):</strong> Pure push/fold</li>
            <li><strong>Dead (M &lt; 3):</strong> Push any reasonable hand</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
