// Calculate M-ratio (stack relative to blinds and antes)
export function calculateMRatio(stack: number, smallBlind: number, bigBlind: number, ante: number, players: number): number {
  const cost = smallBlind + bigBlind + (ante * players)
  return stack / cost
}

// Calculate effective stack in BB
export function calculateEffectiveStackBB(stack: number, bigBlind: number): number {
  return stack / bigBlind
}

// ICM (Independent Chip Model) calculation
export interface Player {
  stack: number
  name?: string
}

export function calculateICM(players: Player[], prizePool: number[]): number[] {
  const totalChips = players.reduce((sum, p) => sum + p.stack, 0)
  
  // Simplified ICM - proportional to stack size weighted by position
  // Real ICM is more complex and requires iterative calculation
  return players.map((player, idx) => {
    const chipPercentage = player.stack / totalChips
    
    // Weight by potential finishing positions
    let equity = 0
    for (let position = 0; position < prizePool.length; position++) {
      const positionProb = calculatePositionProbability(chipPercentage, position, players.length)
      equity += positionProb * prizePool[position]
    }
    
    return equity
  })
}

function calculatePositionProbability(chipPercentage: number, position: number, playerCount: number): number {
  // Simplified: higher chip percentage = higher probability of better finish
  // This is a rough approximation
  if (position === 0) {
    return chipPercentage * chipPercentage // First place favors chip leader more
  } else if (position < playerCount / 2) {
    return chipPercentage * (1 - position / playerCount)
  } else {
    return (1 - chipPercentage) * (position / playerCount)
  }
}

// Push/Fold calculator for short stacks
export function shouldPush(stackBB: number, position: string, handStrength: number): boolean {
  // Nash equilibrium approximation for push/fold
  const positionMultiplier: { [key: string]: number } = {
    'BTN': 1.5,
    'CO': 1.3,
    'MP': 1.1,
    'UTG': 0.9,
    'SB': 1.4,
    'BB': 1.0
  }
  
  const multiplier = positionMultiplier[position] || 1.0
  const threshold = (20 - stackBB) / 20 * multiplier // More aggressive when shorter
  
  return handStrength > threshold
}

// Calculate pot odds
export function calculatePotOdds(potSize: number, callAmount: number): number {
  return callAmount / (potSize + callAmount)
}

// Calculate required equity to call
export function calculateRequiredEquity(potOdds: number): number {
  return potOdds
}

// Bubble factor - adjust strategy near money bubble
export function calculateBubbleFactor(
  position: number, // current position in tournament
  totalPlayers: number,
  paidPlaces: number,
  stackBB: number
): number {
  const playersFromMoney = position - paidPlaces
  
  if (playersFromMoney <= 0) {
    return 1.0 // Already in the money
  }
  
  if (playersFromMoney <= 3) {
    // On the bubble - be more conservative unless very short
    if (stackBB < 10) {
      return 1.2 // Need to gamble
    } else {
      return 0.6 // Can wait for better spots
    }
  }
  
  return 1.0 // Normal play
}
