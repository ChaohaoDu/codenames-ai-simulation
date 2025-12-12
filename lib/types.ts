export type CardType = "red" | "blue" | "neutral" | "assassin"
export type TeamType = "red" | "blue"
export type GamePhase = "spymaster" | "operative"

export interface Card {
  word: string
  type: CardType
  revealed: boolean
}

export interface Clue {
  word: string
  count: number
  team: TeamType
}

export interface Guess {
  word: string
  correct: boolean
  type: CardType
  team: TeamType
}

export interface GameState {
  board: Card[]
  currentTeam: TeamType
  currentPhase: GamePhase
  redRemaining: number
  blueRemaining: number
  turnNumber: number
  currentClue: Clue | null
  guessesRemaining: number
  gameOver: boolean
  winner: TeamType | null
  history: GameEvent[]
}

export interface GameEvent {
  turn: number
  team: TeamType
  phase: GamePhase
  clue?: Clue
  guess?: Guess
  timestamp: number
}

export interface GameStats {
  totalGames: number
  modelAWins: number
  modelBWins: number
  averageTurns: number
  gamesHistory: GameResult[]
}

export interface GameResult {
  gameNumber: number
  winner: TeamType
  turns: number
  redTeamModel: string
  blueTeamModel: string
  duration: number
}

export interface AIModel {
  name: string
  provider: string
}
