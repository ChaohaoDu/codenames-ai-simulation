import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GameStats } from "@/lib/types"
import { BarChart3, Trophy, Zap } from "lucide-react"

interface StatsPanelProps {
  stats: GameStats
  modelAName: string
  modelBName: string
}

export function StatsPanel({ stats, modelAName, modelBName }: StatsPanelProps) {
  const winRate = stats.totalGames > 0 ? ((stats.modelAWins / stats.totalGames) * 100).toFixed(1) : 0

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {/* Total Games */}
      <Card className="bg-card border-2 border-violet-500/30 shadow-lg hover:shadow-violet-500/30 transition-all duration-300 hover:scale-[1.02] group">
        <CardHeader className="p-3 sm:p-4 pb-2">
          <CardTitle className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
            <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Total Games</span>
            <span className="sm:hidden">Games</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="text-2xl sm:text-3xl font-bold text-foreground group-hover:scale-110 transition-transform">
            {stats.totalGames}
          </div>
        </CardContent>
      </Card>

      {/* Avg Turns */}
      <Card className="bg-card border-2 border-cyan-500/30 shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] group">
        <CardHeader className="p-3 sm:p-4 pb-2">
          <CardTitle className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Avg. Turns</span>
            <span className="sm:hidden">Turns</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="text-2xl sm:text-3xl font-bold text-foreground group-hover:scale-110 transition-transform">
            {stats.averageTurns.toFixed(1)}
          </div>
        </CardContent>
      </Card>

      {/* Red Team Wins */}
      <Card className="col-span-2 bg-card border-2 border-[var(--red-team)]/40 shadow-lg hover:shadow-[var(--red-team)]/30 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--red-team)]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
        <CardHeader className="p-3 sm:p-4 pb-2">
          <CardTitle className="text-xs font-semibold text-[var(--red-team)] flex items-center justify-between uppercase tracking-wider relative z-10">
            <span className="flex items-center gap-1.5 sm:gap-2 truncate">
              <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="truncate">{modelAName} Wins</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0 relative z-10">
          <div className="flex justify-between items-baseline">
            <div className="text-3xl sm:text-4xl font-bold text-foreground group-hover:scale-110 transition-transform">{stats.modelAWins}</div>
            <div className="text-xs sm:text-sm font-bold text-[var(--red-team)] bg-[var(--red-team)]/15 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[var(--red-team)]/30 shadow-sm">
              {winRate}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blue Team Wins */}
      <Card className="col-span-2 bg-card border-2 border-[var(--blue-team)]/40 shadow-lg hover:shadow-[var(--blue-team)]/30 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--blue-team)]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
        <CardHeader className="p-3 sm:p-4 pb-2">
          <CardTitle className="text-xs font-semibold text-[var(--blue-team)] flex items-center justify-between uppercase tracking-wider relative z-10">
            <span className="flex items-center gap-1.5 sm:gap-2 truncate">
              <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span className="truncate">{modelBName} Wins</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0 relative z-10">
          <div className="flex justify-between items-baseline">
            <div className="text-3xl sm:text-4xl font-bold text-foreground group-hover:scale-110 transition-transform">{stats.modelBWins}</div>
            <div className="text-xs sm:text-sm font-bold text-[var(--blue-team)] bg-[var(--blue-team)]/15 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[var(--blue-team)]/30 shadow-sm">
              {stats.totalGames > 0 ? ((stats.modelBWins / stats.totalGames) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
