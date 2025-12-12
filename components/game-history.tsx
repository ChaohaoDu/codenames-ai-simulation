"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameStats } from "@/lib/types"
import { Trophy, Clock, Activity } from "lucide-react"

interface GameHistoryProps {
  stats: GameStats
}

export function GameHistory({ stats }: GameHistoryProps) {
  if (stats.gamesHistory.length === 0) {
    return (
      <Card className="bg-card border-2 border-indigo-500/30">
        <CardHeader className="p-4 border-b border-indigo-500/20 bg-indigo-500/5">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg shadow-lg">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-indigo-600 dark:text-indigo-400">
              Game History
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center py-8">No games played yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-2 border-indigo-500/30 shadow-xl h-full flex flex-col">
      <CardHeader className="p-4 pb-3 border-b border-indigo-500/20 bg-indigo-500/5 shrink-0">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg shadow-lg">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="text-indigo-600 dark:text-indigo-400">
            Game History
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
                {stats.gamesHistory
              .slice()
              .reverse()
              .map((game, idx) => {
                const isRecent = idx < 3
                return (
                  <div
                    key={game.gameNumber}
                    className={`relative flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] group ${
                      game.winner === "red"
                        ? "bg-[var(--red-team)]/5 border-[var(--red-team)]/40 hover:shadow-lg hover:shadow-[var(--red-team)]/20"
                        : "bg-[var(--blue-team)]/5 border-[var(--blue-team)]/40 hover:shadow-lg hover:shadow-[var(--blue-team)]/20"
                    } ${isRecent ? 'border-[3px]' : ''}`}
                  >
                    {/* Game Number Badge */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold shadow-md shrink-0 ${
                        game.winner === "red"
                          ? "bg-gradient-to-br from-[var(--red-team)] to-red-600 text-white"
                          : "bg-gradient-to-br from-[var(--blue-team)] to-blue-600 text-white"
                      }`}>
                        #{game.gameNumber}
                      </div>
                      
                      {/* Game Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                          <Trophy
                            className={`h-3 w-3 sm:h-4 sm:w-4 shrink-0 ${game.winner === "red" ? "text-[var(--red-team)]" : "text-[var(--blue-team)]"}`}
                          />
                          <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                            {game.winner === "red" ? game.redTeamModel : game.blueTeamModel}
                          </span>
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                          <span className="flex items-center gap-0.5 sm:gap-1">
                            <Activity className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            {game.turns}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {(game.duration / 1000).toFixed(1)}s
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Winner Badge */}
                    <div
                      className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold shadow-md shrink-0 ${
                        game.winner === "red"
                          ? "bg-gradient-to-r from-[var(--red-team)] to-red-600 text-white"
                          : "bg-gradient-to-r from-[var(--blue-team)] to-blue-600 text-white"
                      }`}
                    >
                      {game.winner.toUpperCase()}
                    </div>
                  </div>
                )
              })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
