// Card types and utilities
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'
export type Suit = '♠' | '♥' | '♦' | '♣'

export interface Card {
  rank: Rank
  suit: Suit
}

export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
export const SUITS: Suit[] = ['♠', '♥', '♦', '♣']

export type Position = 'UTG' | 'UTG+1' | 'MP' | 'CO' | 'BTN' | 'SB' | 'BB'
export type TournamentStage = 'Early' | 'Middle' | 'Late' | 'Bubble' | 'ITM'
export type Action = 'Fold' | 'Call' | 'Raise'

export interface HandAnalysis {
  position: Position
  card1: Card | null
  card2: Card | null
  stackBB: number
  stage: TournamentStage
  actionBefore: string
  recommendation: Action
  reasoning: string
  details: string[]
}

// Calculate hand strength (simplified)
export function getHandStrength(card1: Card | null, card2: Card | null): number {
  if (!card1 || !card2) return 0
  
  const rank1 = RANKS.indexOf(card1.rank)
  const rank2 = RANKS.indexOf(card2.rank)
  const isPair = rank1 === rank2
  const isSuited = card1.suit === card2.suit
  const gap = Math.abs(rank1 - rank2)
  
  let strength = (rank1 + rank2) / 2
  
  if (isPair) strength += 10
  if (isSuited) strength += 2
  if (gap <= 1 && !isPair) strength += 1
  
  return strength / 20 // Normalize to 0-1
}

// Check if hand is a premium hand
export function isPremiumHand(card1: Card | null, card2: Card | null): boolean {
  if (!card1 || !card2) return false
  
  const premiumPairs = ['A', 'K', 'Q', 'J']
  const isPair = card1.rank === card2.rank
  const highCards = ['A', 'K']
  
  if (isPair && premiumPairs.includes(card1.rank)) return true
  if (highCards.includes(card1.rank) && highCards.includes(card2.rank)) return true
  
  return false
}

// Get hand description
export function getHandDescription(card1: Card | null, card2: Card | null): string {
  if (!card1 || !card2) return ''
  
  const rank1 = card1.rank
  const rank2 = card2.rank
  const suited = card1.suit === card2.suit ? 's' : 'o'
  
  if (rank1 === rank2) return `${rank1}${rank2}`
  
  const higherRank = RANKS.indexOf(rank1) > RANKS.indexOf(rank2) ? rank1 : rank2
  const lowerRank = RANKS.indexOf(rank1) > RANKS.indexOf(rank2) ? rank2 : rank1
  
  return `${higherRank}${lowerRank}${suited}`
}
