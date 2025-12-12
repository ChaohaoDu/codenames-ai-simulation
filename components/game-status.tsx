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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Red Team Status */}
        <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 border-2 ${gameState.currentTeam === "red" ? "bg-[var(--red-team)]/10 border-[var(--red-team)] shadow-[0_0_20px_rgba(var(--red-team),0.2)]" : "bg-card/40 border-white/20 backdrop-blur-md"}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[var(--red-team)] ring-4 ring-[var(--red-team)]/20" />
              <span className={`font-bold text-base ${gameState.currentTeam === "red" ? "text-[var(--red-team)]" : "text-foreground"}`}>Red Team</span>
            </div>
            {gameState.currentTeam === "red" && (
              <Badge className="bg-[var(--red-team)] text-white hover:bg-[var(--red-team)]/90 animate-pulse">
                Active Turn
              </Badge>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-5xl font-bold text-foreground tracking-tighter">{gameState.redRemaining}</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Agents Left</div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Brain className="h-4 w-4" />
            {modelAName}
          </div>
        </div>

        {/* Current Turn Info */}
        <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              Turn {gameState.turnNumber}
            </div>
            <div className="flex items-center gap-2 mb-4 justify-center">
              {gameState.currentPhase === "spymaster" ? (
                <Eye className="h-6 w-6 text-primary" />
              ) : (
                <Target className="h-6 w-6 text-accent" />
              )}
              <span className="text-2xl font-bold text-foreground">
                {gameState.currentPhase === "spymaster" ? "Giving Clue" : "Guessing"}
              </span>
            </div>
            {gameState.currentClue ? (
              <div className="bg-primary/5 px-6 py-3 rounded-xl border border-primary/10">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider block mb-1">Current Clue</span>
                <span className="font-mono text-2xl font-bold text-primary">
                  {gameState.currentClue.word} <span className="text-primary/60">({gameState.currentClue.count})</span>
                </span>
              </div>
            ) : (
                <div className="h-[74px] flex items-center justify-center text-muted-foreground text-sm italic">
                    Waiting for spymaster...
                </div>
            )}
            <div className="mt-4 text-xs font-medium text-muted-foreground flex items-center justify-center gap-1.5 opacity-60">
              <Brain className="h-3 w-3" />
              Current: {currentModel}
            </div>
          </div>
        </div>

        {/* Blue Team Status */}
        <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 border-2 ${gameState.currentTeam === "blue" ? "bg-[var(--blue-team)]/10 border-[var(--blue-team)] shadow-[0_0_20px_rgba(var(--blue-team),0.2)]" : "bg-card/40 border-white/20 backdrop-blur-md"}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[var(--blue-team)] ring-4 ring-[var(--blue-team)]/20" />
              <span className={`font-bold text-base ${gameState.currentTeam === "blue" ? "text-[var(--blue-team)]" : "text-foreground"}`}>Blue Team</span>
            </div>
            {gameState.currentTeam === "blue" && (
              <Badge className="bg-[var(--blue-team)] text-white hover:bg-[var(--blue-team)]/90 animate-pulse">
                Active Turn
              </Badge>
            )}
          </div>
           <div className="flex items-baseline gap-2">
            <div className="text-5xl font-bold text-foreground tracking-tighter">{gameState.blueRemaining}</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Agents Left</div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Brain className="h-4 w-4" />
            {modelBName}
          </div>
        </div>
      </div>
    </div>
  )
}
