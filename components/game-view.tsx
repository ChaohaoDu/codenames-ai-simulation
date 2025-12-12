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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 shrink-0">
                <Brain className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight truncate">
                  AI Codenames Simulation
                </h1>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="hidden sm:inline">Comparing AI model performance</span>
                  <span className="sm:hidden">AI Performance</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className="px-2 sm:px-4 py-1 sm:py-1.5 h-auto text-xs sm:text-sm gap-1 sm:gap-2 border-primary/20 bg-primary/5 text-primary font-medium hover:bg-primary/10 transition-colors"
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">AI vs AI</span>
                <span className="sm:hidden">AI</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 lg:py-8">
        {/* Top Section: Game Board & Log - Side by Side on Desktop, Stacked on Mobile */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Left Column: Controls & Board */}
          <div className="flex-1 space-y-4 lg:space-y-6 lg:min-w-0">
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
              <div className="flex justify-center overflow-x-auto">
                 <GameBoard board={gameState.board} showIdentity={true} disabled={true} />
              </div>
          </div>

          {/* Right Column: Game Log - Full Width on Mobile, Fixed Width on Desktop */}
          <div className="w-full lg:w-80 xl:w-96 lg:shrink-0">
             <div className="h-[300px] sm:h-[400px] lg:h-[600px] xl:h-[700px]">
               <GameLog history={gameState.history} redModelName={redModelName} blueModelName={blueModelName} />
             </div>
          </div>
        </div>

        {/* Bottom Section: Stats & Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
             {/* Session Stats */}
             <div className="space-y-3 lg:space-y-4">
                <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2">
                    <Trophy className="h-4 lg:h-5 w-4 lg:w-5 text-primary" />
                    Session Stats
                </h3>
                <StatsPanel stats={stats} modelAName={redModelName} modelBName={blueModelName} />
             </div>

             {/* Global Leaderboard */}
             <div className="space-y-3 lg:space-y-4">
                 <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2">
                     <Sparkles className="h-4 lg:h-5 w-4 lg:w-5 text-yellow-500" />
                     Global Leaderboard
                 </h3>
                 <Leaderboard stats={globalStats} />
             </div>

             {/* Match History */}
             <div className="space-y-3 lg:space-y-4">
                <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2">
                    <Brain className="h-4 lg:h-5 w-4 lg:w-5 text-primary" />
                    Match History
                </h3>
                <div className="h-[300px] sm:h-[350px] lg:h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <GameHistory stats={stats} />
                </div>
            </div>
        </div>

          {/* Game Over Message */}
          {gameState.gameOver && showGameOverModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-3 sm:p-4">
              <div className="bg-card border-2 border-primary rounded-xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
                <Trophy
                  className={`h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 ${
                    gameState.winner === "red" ? "text-[var(--red-team)]" : "text-[var(--blue-team)]"
                  }`}
                />
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Game Over!</h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
                  {gameState.winner === "red" ? redModelName : blueModelName} Wins!
                </p>
                <div className="text-sm text-muted-foreground mb-6 sm:mb-8">Completed in {gameState.turnNumber} turns</div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Button 
                        variant="outline" 
                        onClick={() => setShowGameOverModal(false)}
                        className="w-full sm:flex-1"
                    >
                        Close
                    </Button>
                    <Button 
                        onClick={() => {
                            startNewGame()
                            setShowGameOverModal(false) 
                        }}
                        className="w-full sm:flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
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
