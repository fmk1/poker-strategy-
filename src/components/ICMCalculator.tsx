import { useState } from 'react'
import { calculateICM, Player } from '../utils/tournamentCalcs'

export default function ICMCalculator() {
  const [players, setPlayers] = useState<Player[]>([
    { stack: 10000, name: 'Player 1' },
    { stack: 8000, name: 'Player 2' },
    { stack: 5000, name: 'Player 3' },
    { stack: 2000, name: 'Player 4' },
  ])
  const [prizePool, setPrizePool] = useState<number[]>([5000, 3000, 2000])

  const updatePlayerStack = (index: number, stack: number) => {
    const newPlayers = [...players]
    newPlayers[index].stack = stack
    setPlayers(newPlayers)
  }

  const updatePrize = (index: number, prize: number) => {
    const newPrizes = [...prizePool]
    newPrizes[index] = prize
    setPrizePool(newPrizes)
  }

  const addPlayer = () => {
    setPlayers([...players, { stack: 5000, name: `Player ${players.length + 1}` }])
  }

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index))
    }
  }

  const icmValues = calculateICM(players, prizePool)
  const totalPrizes = prizePool.reduce((a, b) => a + b, 0)

  return (
    <div>
      <h2>ICM Calculator</h2>
      <p>Calculate Independent Chip Model equity based on stack sizes and prize structure</p>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr', marginTop: '2rem' }}>
        <div>
          <h3>Player Stacks</h3>
          {players.map((player, idx) => (
            <div key={idx} className="input-group">
              <label>{player.name}</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  value={player.stack}
                  onChange={(e) => updatePlayerStack(idx, Number(e.target.value))}
                  min="0"
                />
                {players.length > 2 && (
                  <button onClick={() => removePlayer(idx)} style={{ padding: '0.5rem 1rem' }}>❌</button>
                )}
              </div>
            </div>
          ))}
          <button onClick={addPlayer} style={{ marginTop: '1rem' }}>Add Player</button>
        </div>

        <div>
          <h3>Prize Pool</h3>
          {prizePool.map((prize, idx) => (
            <div key={idx} className="input-group">
              <label>{idx + 1}{idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'} Place</label>
              <input
                type="number"
                value={prize}
                onChange={(e) => updatePrize(idx, Number(e.target.value))}
                min="0"
              />
            </div>
          ))}
          <div style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Total: ${totalPrizes.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="recommendation" style={{ marginTop: '2rem' }}>
        <h3>ICM Values</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #646cff' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Player</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Stack</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>Chip %</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>ICM Value</th>
              <th style={{ padding: '0.5rem', textAlign: 'right' }}>$ / Chip</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => {
              const totalChips = players.reduce((sum, p) => sum + p.stack, 0)
              const chipPercent = (player.stack / totalChips * 100)
              const icmValue = icmValues[idx]
              const dollarPerChip = icmValue / player.stack
              
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '0.5rem' }}>{player.name}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{player.stack.toLocaleString()}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{chipPercent.toFixed(1)}%</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 'bold', color: '#4ecdc4' }}>
                    ${icmValue.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.9rem' }}>
                    ${dollarPerChip.toFixed(4)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="recommendation-details" style={{ marginTop: '2rem' }}>
          <h4>What is ICM?</h4>
          <p>
            Independent Chip Model (ICM) calculates the real money value of your chips in a tournament based on the payout structure and remaining stacks.
          </p>
          <h4>Key Insights:</h4>
          <ul>
            <li><strong>Chip ≠ Money:</strong> Tournament chips are worth less as you accumulate more</li>
            <li><strong>Short stacks:</strong> Each chip is worth more (survival value)</li>
            <li><strong>Big stacks:</strong> Each additional chip is worth less</li>
            <li><strong>Bubble play:</strong> ICM pressure is highest near money jumps</li>
            <li><strong>Risk premium:</strong> Avoid marginal spots when others can bust</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
