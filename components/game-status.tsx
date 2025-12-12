import { Badge } from "@/components/ui/badge"
import type { GameState } from "@/lib/types"
import { Brain, Eye, Target } from "lucide-react"

interface GameStatusProps {
  gameState: GameState
  modelAName: string
  modelBName: string
}

export function GameStatus({ gameState, modelAName, modelBName }: GameStatusProps) {
  const currentModel = gameState.currentTeam === "red" ? modelAName : modelBName

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3 lg:gap-6">
        {/* Red Team Status */}
        <div className={`relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-4 lg:p-6 transition-all duration-300 border-2 ${gameState.currentTeam === "red" ? "bg-[var(--red-team)]/10 border-[var(--red-team)] shadow-[0_0_20px_rgba(var(--red-team),0.2)]" : "bg-card/40 border-white/20 backdrop-blur-md"}`}>
          <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-1 sm:mb-3 lg:mb-4">
            <div className="flex items-center gap-0.5 sm:gap-2 lg:gap-3 mb-0.5 sm:mb-0">
              <div className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 rounded-full bg-[var(--red-team)] ring-1 sm:ring-2 lg:ring-4 ring-[var(--red-team)]/20" />
              <span className={`font-bold text-[9px] sm:text-sm lg:text-base ${gameState.currentTeam === "red" ? "text-[var(--red-team)]" : "text-foreground"}`}>Red</span>
            </div>
            {gameState.currentTeam === "red" && (
              <Badge className="bg-[var(--red-team)] text-white hover:bg-[var(--red-team)]/90 animate-pulse text-[7px] sm:text-xs px-0.5 py-0 sm:px-2 sm:py-1 leading-tight">
                Active
              </Badge>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-0.5 sm:gap-2 mb-1 sm:mb-0">
            <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground tracking-tighter">{gameState.redRemaining}</div>
            <div className="text-[7px] sm:text-xs lg:text-sm font-medium text-muted-foreground uppercase tracking-wider">Left</div>
          </div>
          <div className="hidden sm:flex mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-3 lg:pt-4 border-t border-border/50 items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs lg:text-sm font-medium text-muted-foreground">
            <Brain className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 shrink-0" />
            <span className="truncate text-[10px] sm:text-xs">{modelAName}</span>
          </div>
        </div>

        {/* Current Turn Info */}
        <div className="flex flex-col items-center justify-center text-center p-2 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl bg-card/40 backdrop-blur-md border border-white/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
          <div className="relative w-full">
            <div className="inline-flex items-center gap-0.5 sm:gap-1.5 lg:gap-2 px-1 sm:px-2.5 lg:px-3 py-0 sm:py-1 rounded-full bg-primary/10 text-primary text-[7px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 sm:mb-2 lg:mb-3">
              T{gameState.turnNumber}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 mb-1 sm:mb-3 lg:mb-4 justify-center">
              {gameState.currentPhase === "spymaster" ? (
                <Eye className="h-3.5 w-3.5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
              ) : (
                <Target className="h-3.5 w-3.5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-accent" />
              )}
              <span className="text-[9px] sm:text-lg lg:text-2xl font-bold text-foreground leading-tight">
                {gameState.currentPhase === "spymaster" ? "Clue" : "Guess"}
              </span>
            </div>
            {gameState.currentClue ? (
              <div className="bg-primary/5 px-1.5 sm:px-4 lg:px-6 py-0.5 sm:py-2 lg:py-3 rounded-md sm:rounded-lg lg:rounded-xl border border-primary/10">
                <span className="hidden sm:block text-[8px] sm:text-xs lg:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Clue</span>
                <span className="font-mono text-[10px] sm:text-lg lg:text-2xl font-bold text-primary break-words">
                  {gameState.currentClue.word} <span className="text-primary/60">({gameState.currentClue.count})</span>
                </span>
              </div>
            ) : (
                <div className="h-[35px] sm:h-[60px] lg:h-[74px] flex items-center justify-center text-muted-foreground text-[7px] sm:text-xs lg:text-sm italic px-1">
                    Waiting...
                </div>
            )}
            <div className="hidden sm:flex mt-2 sm:mt-3 lg:mt-4 text-[8px] sm:text-xs font-medium text-muted-foreground items-center justify-center gap-1 sm:gap-1.5 opacity-60">
              <Brain className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-[200px]">{currentModel}</span>
            </div>
          </div>
        </div>

        {/* Blue Team Status */}
        <div className={`relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-4 lg:p-6 transition-all duration-300 border-2 ${gameState.currentTeam === "blue" ? "bg-[var(--blue-team)]/10 border-[var(--blue-team)] shadow-[0_0_20px_rgba(var(--blue-team),0.2)]" : "bg-card/40 border-white/20 backdrop-blur-md"}`}>
          <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-1 sm:mb-3 lg:mb-4">
            <div className="flex items-center gap-0.5 sm:gap-2 lg:gap-3 mb-0.5 sm:mb-0">
              <div className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 rounded-full bg-[var(--blue-team)] ring-1 sm:ring-2 lg:ring-4 ring-[var(--blue-team)]/20" />
              <span className={`font-bold text-[9px] sm:text-sm lg:text-base ${gameState.currentTeam === "blue" ? "text-[var(--blue-team)]" : "text-foreground"}`}>Blue</span>
            </div>
            {gameState.currentTeam === "blue" && (
              <Badge className="bg-[var(--blue-team)] text-white hover:bg-[var(--blue-team)]/90 animate-pulse text-[7px] sm:text-xs px-0.5 py-0 sm:px-2 sm:py-1 leading-tight">
                Active
              </Badge>
            )}
          </div>
           <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-0.5 sm:gap-2 mb-1 sm:mb-0">
            <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground tracking-tighter">{gameState.blueRemaining}</div>
            <div className="text-[7px] sm:text-xs lg:text-sm font-medium text-muted-foreground uppercase tracking-wider">Left</div>
          </div>
          <div className="hidden sm:flex mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-3 lg:pt-4 border-t border-border/50 items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs lg:text-sm font-medium text-muted-foreground">
            <Brain className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 shrink-0" />
            <span className="truncate text-[10px] sm:text-xs">{modelBName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
