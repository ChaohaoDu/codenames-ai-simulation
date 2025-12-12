"use client"

import { GameBoard } from "@/components/game-board"
import { GameControls } from "@/components/game-controls"
import { GameHistory } from "@/components/game-history"
import { GameStatus } from "@/components/game-status"
import { GameLog } from "@/components/game-log"
import { Leaderboard } from "@/components/leaderboard"
import { StatsPanel } from "@/components/stats-panel"
import { Badge } from "@/components/ui/badge"
import { useGameSimulation } from "@/hooks/use-game-simulation"
import { AI_MODELS } from "@/lib/ai-service"
import type { GameState } from "@/lib/types"
import { Brain, Sparkles, Trophy } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface GameViewProps {
  initialGameState: GameState
}

export function GameView({ initialGameState }: GameViewProps) {
  const {
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
  } = useGameSimulation(initialGameState)

  const redModelName = AI_MODELS[redModelId]?.name || "Unknown"
  const blueModelName = AI_MODELS[blueModelId]?.name || "Unknown"

  const [showGameOverModal, setShowGameOverModal] = useState(false)

  // Show modal when game ends
  useEffect(() => {
    if (gameState.gameOver) {
        setShowGameOverModal(true)
    } else {
        setShowGameOverModal(false)
    }
  }, [gameState.gameOver])

  // Auto-play AI moves
  useEffect(() => {
    if (isPlaying && !gameState.gameOver) {
      const timer = setTimeout(() => {
        makeAIMove()
      }, speed)
      return () => clearTimeout(timer)
    }

    if (gameState.gameOver && isPlaying) {
      // Wait before starting new game (recording is handled in runSimulation)
      const timer = setTimeout(() => {
        startNewGame()
      }, speed * 2)
      return () => clearTimeout(timer)
    }
  }, [gameState, isPlaying, speed, makeAIMove, startNewGame])

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">
                  AI Codenames Simulation
                </h1>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Comparing AI model performance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="px-4 py-1.5 h-auto text-sm gap-2 border-primary/20 bg-primary/5 text-primary font-medium hover:bg-primary/10 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                AI vs AI
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Top Section: Game Board & Log - Side by Side */}
        <div className="flex gap-6 mb-8">
          {/* Left Column: Controls & Board */}
          <div className="flex-1 space-y-6" style={{ flexBasis: '75%' }}>
              <GameControls
                isPlaying={isPlaying}
                onPlayPause={() => {
                  if (!isPlaying) {
                    if (gameState.gameOver) {
                      startNewGame()
                    }
                    runSimulation(1)
                  }
                }}
                onReset={() => {
                  startNewGame()
                }}
                redModelId={redModelId}
                onRedModelChange={setRedModelId}
                blueModelId={blueModelId}
                onBlueModelChange={setBlueModelId}
              />
              <GameStatus gameState={gameState} modelAName={redModelName} modelBName={blueModelName} />
              <div className="flex justify-center">
                 <GameBoard board={gameState.board} showIdentity={true} disabled={true} />
              </div>
          </div>

          {/* Right Column: Game Log */}
          <div className="w-80 shrink-0" style={{ maxHeight: '800px' }}>
             <GameLog history={gameState.history} redModelName={redModelName} blueModelName={blueModelName} />
          </div>
        </div>

        {/* Bottom Section: Stats & Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Session Stats */}
             <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Session Stats
                </h3>
                <StatsPanel stats={stats} modelAName={redModelName} modelBName={blueModelName} />
             </div>

             {/* Global Leaderboard */}
             <div className="space-y-4">
                 <h3 className="text-lg font-semibold flex items-center gap-2">
                     <Sparkles className="h-5 w-5 text-yellow-500" />
                     Global Leaderboard
                 </h3>
                 <Leaderboard stats={globalStats} />
             </div>

             {/* Match History */}
             <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Match History
                </h3>
                <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <GameHistory stats={stats} />
                </div>
            </div>
        </div>

          {/* Game Over Message */}
          {gameState.gameOver && showGameOverModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
              <div className="bg-card border-2 border-primary rounded-xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
                <Trophy
                  className={`h-16 w-16 mx-auto mb-4 ${
                    gameState.winner === "red" ? "text-[var(--red-team)]" : "text-[var(--blue-team)]"
                  }`}
                />
                <h2 className="text-3xl font-bold text-foreground mb-2">Game Over!</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {gameState.winner === "red" ? redModelName : blueModelName} Wins!
                </p>
                <div className="text-sm text-muted-foreground mb-8">Completed in {gameState.turnNumber} turns</div>
                
                <div className="flex gap-4 justify-center">
                    <Button 
                        variant="outline" 
                        onClick={() => setShowGameOverModal(false)}
                        className="flex-1"
                    >
                        Close
                    </Button>
                    <Button 
                        onClick={() => {
                            startNewGame()
                            setShowGameOverModal(false) 
                        }}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Play Again
                    </Button>
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  )
}
