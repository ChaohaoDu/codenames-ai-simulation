"use client"

import { AI_MODELS } from "@/lib/ai-service"
import { initializeGame, revealCard, switchTurn } from "@/lib/game-engine"
import type { Clue, GameResult, GameState, GameStats } from "@/lib/types"
import type { ModelStat } from "@/lib/db"
import { useCallback, useRef, useState, useEffect } from "react"

export function useGameSimulation(initialGameState?: GameState) {
  const [gameState, setGameState] = useState<GameState>(initialGameState || initializeGame("red"))
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    modelAWins: 0,
    modelBWins: 0,
    averageTurns: 0,
    gamesHistory: [],
  })
  const [globalStats, setGlobalStats] = useState<ModelStat[]>([])
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const gameStartTime = useRef<number>(0)

  const [redModelId, setRedModelId] = useState<string>("gpt-4o")
  const [blueModelId, setBlueModelId] = useState<string>("claude-3-sonnet")

  const fetchGlobalStats = useCallback(async () => {
      try {
          const res = await fetch("/api/stats")
          const data = await res.json()
          if (data.leaderboard) {
              setGlobalStats(data.leaderboard)
          }
      } catch (e) {
          console.error("Failed to fetch global stats", e)
      }
  }, [])

  useEffect(() => {
      fetchGlobalStats()
  }, [fetchGlobalStats])

  const getCurrentModelId = useCallback(() => {
    const modelKey = gameState.currentTeam === "red" ? redModelId : blueModelId
    return AI_MODELS[modelKey]?.modelId || AI_MODELS["gpt-4o"].modelId
  }, [gameState.currentTeam, redModelId, blueModelId])

  const makeAIMove = useCallback(async () => {
    if (gameState.gameOver) return

    const modelId = getCurrentModelId()

    try {
      const response = await fetch("/api/ai-move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameState, modelId }),
      })

      const data = await response.json()

      if (data.type === "clue") {
        const clue: Clue = data.clue
        const historyEvent = {
            turn: gameState.turnNumber,
            team: gameState.currentTeam,
            phase: "spymaster" as const,
            clue: clue,
            timestamp: Date.now(),
        }

        setGameState((prev) => ({
          ...prev,
          currentClue: clue,
          currentPhase: "operative",
          guessesRemaining: clue.count + 1,
          history: [...prev.history, historyEvent]
        }))
      } else if (data.type === "guess") {
        const guess: string = data.guess
        const reasoning: string | undefined = data.reasoning
        console.log('[GameSim] Received guess:', { guess, reasoning, dataType: typeof reasoning })
        const cardIndex = gameState.board.findIndex((card) => card.word === guess)

        if (cardIndex !== -1) {
            const card = gameState.board[cardIndex]
            const isCorrect = card.type === gameState.currentTeam
            const guessEvent = {
                turn: gameState.turnNumber,
                team: gameState.currentTeam,
                phase: "operative" as const,
                guess: {
                    word: guess,
                    correct: isCorrect,
                    type: card.type,
                    team: gameState.currentTeam,
                    reasoning
                },
                timestamp: Date.now()
            }
            console.log('[GameSim] Created guess event:', guessEvent)

          const newState = revealCard(gameState, cardIndex)
          
          // Append history (revealCard preserves existing history, we append new event)
          newState.history = [...gameState.history, guessEvent]
          
          setGameState(newState)

          if (!newState.gameOver && newState.guessesRemaining > 0) {
            return
          }

          if (!newState.gameOver) {
            const switchedState = switchTurn(newState)
            setGameState(switchedState)
          }
        }
      }
    } catch (error) {
      console.error("[v0] AI move failed:", error)
    }
  }, [gameState, getCurrentModelId])

  const startNewGame = useCallback(() => {
    const newGame = initializeGame("red")
    setGameState(newGame)
    gameStartTime.current = Date.now()
  }, [])

  const recordGameResult = useCallback(async () => {
    if (!gameState.gameOver || !gameState.winner) return

    const duration = Date.now() - gameStartTime.current
    const winner = gameState.winner
    const turns = gameState.turnNumber
    
    // Save to global DB
    try {
         await fetch("/api/stats", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
                 redModelId,
                 blueModelId,
                 winner,
                 turns
             })
         })
         fetchGlobalStats() // Refresh leaderboard
    } catch (e) {
        console.error("Failed to save global stats", e)
    }

    setStats((prev) => {
      const result: GameResult = {
        gameNumber: prev.totalGames + 1,
        winner: winner,
        turns: turns,
        redTeamModel: AI_MODELS[redModelId]?.name || "Unknown",
        blueTeamModel: AI_MODELS[blueModelId]?.name || "Unknown",
        duration,
      }

      const newHistory = [...prev.gamesHistory, result]
      const modelAWins = prev.modelAWins + (winner === "red" ? 1 : 0)
      const modelBWins = prev.modelBWins + (winner === "blue" ? 1 : 0)
      const totalGames = prev.totalGames + 1
      const totalTurns = newHistory.reduce((sum, game) => sum + game.turns, 0)

      return {
        totalGames,
        modelAWins,
        modelBWins,
        averageTurns: totalTurns / totalGames,
        gamesHistory: newHistory,
      }
    })
  }, [gameState, redModelId, blueModelId, fetchGlobalStats])

  const runSimulation = useCallback(
    async (gamesToRun: number) => {
      setIsPlaying(true)

      // We need to fetch the BASE stats once at the start to ensure we increment correctly
      // However, we can't reliably read 'stats' from closure if it's stale.
      // But updating state inside the loop via setStats(prev => ...) is safe.
      // The issue is gameNumber needs to be sequential.
      // We will track local increment relative to the START of this batch.

      for (let i = 0; i < gamesToRun; i++) {
        startNewGame()

        let currentState = initializeGame("red")
        gameStartTime.current = Date.now()

        while (!currentState.gameOver) {
          const modelKey = currentState.currentTeam === "red" ? redModelId : blueModelId
          const modelId = AI_MODELS[modelKey]?.modelId

          try {
            const response = await fetch("/api/ai-move", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ gameState: currentState, modelId }),
            })

            const data = await response.json()

            if (data.type === "clue") {
              const clue: Clue = data.clue
              const historyEvent = {
                turn: currentState.turnNumber,
                team: currentState.currentTeam,
                phase: "spymaster" as const,
                clue: clue,
                timestamp: Date.now(),
              }
              
              currentState = {
                ...currentState,
                currentClue: clue,
                currentPhase: "operative",
                guessesRemaining: clue.count + 1,
                history: [...currentState.history, historyEvent]
              }

              await new Promise((resolve) => setTimeout(resolve, speed / 2))
            } else if (data.type === "guess") {
              const guess: string = data.guess
              const reasoning: string | undefined = data.reasoning
              const cardIndex = currentState.board.findIndex((card) => card.word === guess)

              if (cardIndex !== -1) {
                const card = currentState.board[cardIndex]
                const isCorrect = card.type === currentState.currentTeam
                const guessEvent = {
                    turn: currentState.turnNumber,
                    team: currentState.currentTeam,
                    phase: "operative" as const,
                    guess: {
                        word: guess,
                        correct: isCorrect,
                        type: card.type,
                        team: currentState.currentTeam,
                        reasoning
                    },
                    timestamp: Date.now()
                }

                currentState = revealCard(currentState, cardIndex)
                currentState.history = [...currentState.history, guessEvent]

                if (!currentState.gameOver && currentState.guessesRemaining === 0) {
                  currentState = switchTurn(currentState)
                }

                await new Promise((resolve) => setTimeout(resolve, speed / 2))
              }
            }
          } catch (error) {
            console.error("[v0] Simulation move failed:", error)
            break
          }
        }

        const duration = Date.now() - gameStartTime.current
        const winner = currentState.winner!
        
        // Save to global DB (batch mostly)
        try {
             await fetch("/api/stats", {
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({
                     redModelId,
                     blueModelId,
                     winner,
                     turns: currentState.turnNumber
                 })
             })
        } catch (e) { console.error("Failed to save stat", e) }

        // Functional update ensures we use latest state even inside async loop
        setStats((prev) => {
            const result: GameResult = {
            gameNumber: prev.totalGames + 1,
            winner: winner,
            turns: currentState.turnNumber,
            redTeamModel: AI_MODELS[redModelId]?.name || "Unknown",
            blueTeamModel: AI_MODELS[blueModelId]?.name || "Unknown",
            duration,
            }

            const newHistory = [...prev.gamesHistory, result]
            const modelAWins = prev.modelAWins + (winner === "red" ? 1 : 0)
            const modelBWins = prev.modelBWins + (winner === "blue" ? 1 : 0)
            const totalGames = prev.totalGames + 1
            const totalTurns = newHistory.reduce((sum, game) => sum + game.turns, 0)

            return {
                totalGames,
                modelAWins,
                modelBWins,
                averageTurns: totalTurns / totalGames,
                gamesHistory: newHistory,
            }
        })

        setGameState(currentState)
        await new Promise((resolve) => setTimeout(resolve, speed))
      }
      
      // Refresh global stats after batch
      fetchGlobalStats()

      setIsPlaying(false)
    },
    [speed, redModelId, blueModelId, fetchGlobalStats],
  )

  return {
    gameState,
    stats,
    globalStats,
    isPlaying,
    speed,
    setSpeed,
    makeAIMove,
    startNewGame,
    recordGameResult,
    runSimulation,
    redModelId,
    setRedModelId,
    blueModelId,
    setBlueModelId,
  }
}
