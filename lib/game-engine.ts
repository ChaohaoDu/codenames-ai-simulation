import type { Card, CardType, GameState, TeamType } from "./types"
import { getRandomWords } from "./word-bank"

export function initializeGame(startingTeam: TeamType = "red"): GameState {
  const words = getRandomWords(25)
  const cardTypes: CardType[] = [
    ...Array(9).fill(startingTeam === "red" ? "red" : "blue"),
    ...Array(8).fill(startingTeam === "red" ? "blue" : "red"),
    ...Array(7).fill("neutral"),
    "assassin",
  ]

  // Shuffle card types
  const shuffledTypes = cardTypes.sort(() => Math.random() - 0.5)

  const board: Card[] = words.map((word, index) => ({
    word,
    type: shuffledTypes[index],
    revealed: false,
  }))

  return {
    board,
    currentTeam: startingTeam,
    currentPhase: "spymaster",
    redRemaining: startingTeam === "red" ? 9 : 8,
    blueRemaining: startingTeam === "blue" ? 9 : 8,
    turnNumber: 1,
    currentClue: null,
    guessesRemaining: 0,
    gameOver: false,
    winner: null,
    history: [],
  }
}

export function revealCard(state: GameState, cardIndex: number): GameState {
  const newBoard = [...state.board]
  const card = newBoard[cardIndex]

  if (card.revealed || state.gameOver) {
    return state
  }

  card.revealed = true

  const newState = { ...state, board: newBoard }

  // Update remaining counts
  if (card.type === "red") {
    newState.redRemaining--
  } else if (card.type === "blue") {
    newState.blueRemaining--
  }

  // Check for assassin
  if (card.type === "assassin") {
    newState.gameOver = true
    newState.winner = state.currentTeam === "red" ? "blue" : "red"
    return newState
  }

  // Check for win
  if (newState.redRemaining === 0) {
    newState.gameOver = true
    newState.winner = "red"
    return newState
  }

  if (newState.blueRemaining === 0) {
    newState.gameOver = true
    newState.winner = "blue"
    return newState
  }

  // Decrement guesses if correct team
  if (card.type === state.currentTeam) {
    newState.guessesRemaining--
  } else {
    // Wrong guess, end turn
    newState.guessesRemaining = 0
  }

  return newState
}

export function switchTurn(state: GameState): GameState {
  return {
    ...state,
    currentTeam: state.currentTeam === "red" ? "blue" : "red",
    currentPhase: "spymaster",
    currentClue: null,
    guessesRemaining: 0,
    turnNumber: state.turnNumber + 1,
  }
}
