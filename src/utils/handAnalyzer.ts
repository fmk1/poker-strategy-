import { Position, TournamentStage, Action, HandAnalysis, Card, getHandStrength, isPremiumHand, getHandDescription } from './pokerTypes'

// Analyze a hand and provide recommendations
export function analyzeHand(
  position: Position,
  card1: Card | null,
  card2: Card | null,
  stackBB: number,
  stage: TournamentStage,
  actionBefore: string
): HandAnalysis {
  const strength = getHandStrength(card1, card2)
  const isPremium = isPremiumHand(card1, card2)
  const handDesc = getHandDescription(card1, card2)
  
  let recommendation: Action = 'Fold'
  let reasoning = ''
  const details: string[] = []
  
  // Early position logic
  const earlyPositions: Position[] = ['UTG', 'UTG+1', 'MP']
  const latePositions: Position[] = ['CO', 'BTN']
  const blinds: Position[] = ['SB', 'BB']
  
  const isEarlyPos = earlyPositions.includes(position)
  const isLatePos = latePositions.includes(position)
  const isBlind = blinds.includes(position)
  
  // Stack considerations
  const isShortStack = stackBB < 15
  const isMediumStack = stackBB >= 15 && stackBB < 40
  const isDeepStack = stackBB >= 40
  
  // Tournament stage considerations
  const isBubble = stage === 'Bubble'
  const isEarly = stage === 'Early'
  
  // Analyze based on position and hand strength
  if (isPremium) {
    recommendation = 'Raise'
    reasoning = `${handDesc} is a premium hand - strong raise regardless of position`
    details.push('Premium hands should almost always be played aggressively')
    details.push('Raise to 2.5-3x BB to build the pot and protect your hand')
  } else if (isShortStack) {
    // Push/fold strategy for short stacks
    if (strength > 0.4) {
      recommendation = 'Raise'
      reasoning = `With ${stackBB.toFixed(1)} BB, you're in push/fold territory. ${handDesc} is strong enough to shove.`
      details.push('Short stack (< 15 BB) requires push/fold strategy')
      details.push('This hand has good equity even when called')
    } else if (strength > 0.25 && isLatePos) {
      recommendation = 'Raise'
      reasoning = `${handDesc} is acceptable for a late position shove with ${stackBB.toFixed(1)} BB`
      details.push('Late position allows for wider shoving ranges')
    } else {
      recommendation = 'Fold'
      reasoning = `${handDesc} is too weak for a shove with ${stackBB.toFixed(1)} BB from ${position}`
      details.push('Preserve your stack for better spots')
    }
  } else if (isMediumStack) {
    if (strength > 0.6) {
      recommendation = 'Raise'
      reasoning = `${handDesc} is strong - raise to 2.5-3x BB`
      details.push('Build the pot with your strong hand')
      details.push('Medium stack allows for standard raising strategy')
    } else if (strength > 0.45 && !isEarlyPos) {
      recommendation = 'Raise'
      reasoning = `${handDesc} is playable from ${position} - raise to steal blinds`
      details.push('Late position gives you positional advantage')
      details.push('Many hands will fold, allowing you to win the blinds')
    } else if (strength > 0.35 && isBlind && actionBefore === 'Fold') {
      recommendation = 'Call'
      reasoning = `In the blinds with ${handDesc} - call to see a cheap flop`
      details.push('You already have money invested in the blinds')
      details.push('Getting good pot odds to see the flop')
    } else {
      recommendation = 'Fold'
      reasoning = `${handDesc} is too weak from ${position}`
      details.push('Wait for a better hand or better position')
    }
  } else {
    // Deep stack strategy
    if (strength > 0.55) {
      recommendation = 'Raise'
      reasoning = `${handDesc} is a solid hand - raise to 2.5-3x BB`
      details.push('Deep stacks allow for more postflop play')
      details.push('Raise for value and to take control of the hand')
    } else if (strength > 0.4 && isLatePos) {
      recommendation = 'Raise'
      reasoning = `${handDesc} from ${position} - good steal opportunity`
      details.push('Late position gives you control postflop')
      details.push('Wide raising range is profitable here')
    } else if (strength > 0.35 && actionBefore === 'Fold' && !isEarlyPos) {
      recommendation = 'Call'
      reasoning = `${handDesc} is a speculative hand - call to see a flop`
      details.push('You can outplay opponents postflop with position')
      details.push('Fold if you miss the flop')
    } else {
      recommendation = 'Fold'
      reasoning = `${handDesc} is too weak from ${position} with deep stacks`
      details.push('Deep stacks require tighter ranges early')
      details.push('Wait for better spots')
    }
  }
  
  // Bubble considerations
  if (isBubble && !isPremium) {
    if (recommendation === 'Raise' && strength < 0.7) {
      if (isMediumStack || isDeepStack) {
        recommendation = 'Fold'
        reasoning = `On the bubble with ${handDesc} - fold and wait for better spots`
        details.push('Bubble pressure: survival is key')
        details.push('Short stacks will be forced to gamble soon')
      }
    }
  }
  
  return {
    position,
    card1,
    card2,
    stackBB,
    stage,
    actionBefore,
    recommendation,
    reasoning,
    details
  }
}
