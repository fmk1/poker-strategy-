import { useState } from 'react'
import { shouldPush } from '../utils/tournamentCalcs'

const POSITIONS = ['BTN', 'CO', 'MP', 'UTG', 'SB', 'BB']

export default function PushFoldCalculator() {
  const [stackBB, setStackBB] = useState<number>(10)
  const [position, setPosition] = useState<string>('BTN')
  const [handStrength, setHandStrength] = useState<number>(0.5)

  const shouldPushResult = shouldPush(stackBB, position, handStrength)

  return (
    <div>
      <h2>Push/Fold Calculator</h2>
      <p>Calculate Nash equilibrium push/fold ranges for short stack play</p>

      <div className="calculator-grid">
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

        <div className="input-group">
          <label>Hand Strength (0-1): {handStrength.toFixed(2)}</label>
          <input
            type="range"
            value={handStrength}
            onChange={(e) => setHandStrength(Number(e.target.value))}
            min="0"
            max="1"
            step="0.01"
          />
          <small>Premium hands ≈ 0.8+, Medium ≈ 0.5, Weak ≈ 0.3</small>
        </div>
      </div>

      <div className="recommendation" style={{ marginTop: '2rem' }}>
        <h3>Push/Fold Decision</h3>
        <div className={`recommendation-action ${shouldPushResult ? 'raise' : 'fold'}`}>
          {shouldPushResult ? 'PUSH (All-In)' : 'FOLD'}
        </div>
        <div className="recommendation-details">
          <p>
            With {stackBB} BB from {position}, this hand {shouldPushResult ? 'is' : 'is not'} strong enough to push all-in according to Nash equilibrium.
          </p>
          <h4>Key Points:</h4>
          <ul>
            <li>Stack size: {stackBB} BB - {stackBB < 10 ? 'Critical (push/fold only)' : 'Short stack territory'}</li>
            <li>Position: {position} - {['BTN', 'CO'].includes(position) ? 'Late (wider range)' : 'Early (tighter range)'}</li>
            <li>Hand strength: {(handStrength * 100).toFixed(0)}%</li>
            {stackBB < 8 && <li>⚠️ Very short - need to find spots soon or you'll blind out</li>}
            {shouldPushResult && <li>✅ This hand has enough equity when called</li>}
          </ul>
        </div>
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
