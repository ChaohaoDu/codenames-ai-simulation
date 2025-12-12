"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameEvent } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AlertCircle, Brain, CheckCircle2, Target, XCircle } from "lucide-react"
import { useEffect, useRef } from "react"

interface GameLogProps {
  history: GameEvent[]
  redModelName: string
  blueModelName: string
}

export function GameLog({ history, redModelName, blueModelName }: GameLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [history])

  if (history.length === 0) {
    return (
      <Card className="bg-card/40 backdrop-blur-md border border-white/20 h-full">
        <CardHeader className="pb-2 p-3 sm:p-4">
          <CardTitle className="text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            Live Game Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-xs sm:text-sm italic">
            Waiting for game to start...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/40 backdrop-blur-md border border-white/20 flex flex-col h-full">
      <CardHeader className="hidden sm:flex pb-2 sm:pb-3 p-3 sm:p-4 border-b border-white/10 shrink-0">
        <CardTitle className="text-xs sm:text-sm font-semibold flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          Live Game Log
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full w-full p-2 sm:p-3 lg:p-4" ref={scrollRef}>
          <div className="space-y-2 sm:space-y-3">
            {history.map((event, index) => {
              const isRed = event.team === "red"
              const modelName = isRed ? redModelName : blueModelName
              const teamColorClass = isRed ? "text-[var(--red-team)]" : "text-[var(--blue-team)]"
              const bgClass = isRed ? "bg-[var(--red-team)]/5" : "bg-[var(--blue-team)]/5"
              const borderClass = isRed ? "border-[var(--red-team)]/20" : "border-[var(--blue-team)]/20"

              if (event.phase === "spymaster" && event.clue) {
                return (
                  <div key={index} className={cn("p-2 rounded-lg border text-xs sm:text-sm", bgClass, borderClass)}>
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <Brain className={cn("h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0", teamColorClass)} />
                      <span className={cn("font-bold text-[10px] sm:text-xs uppercase opacity-70 truncate", teamColorClass)}>
                        {event.team} LEADER
                      </span>
                    </div>
                    <div className="font-mono font-medium pl-3 sm:pl-5 text-xs sm:text-sm">
                      Gives clue: <span className="font-bold">{event.clue.word}</span> <span className="bg-primary/10 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs">{event.clue.count}</span>
                    </div>
                  </div>
                )
              }

              if (event.phase === "operative" && event.guess) {
                 let icon = <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500" />
                 let status = "Correct"
                 
                 if (event.guess.type === "assassin") {
                     icon = <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[var(--assassin)]" />
                     status = "ASSASSIN!"
                 } else if (event.guess.type !== event.team) {
                     icon = <XCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" />
                     status = "Miss"
                 }

                return (
                  <div key={index} className={cn("p-2 rounded-lg border text-xs sm:text-sm ml-2 sm:ml-4", "bg-card/50", "border-border/50")}>
                     <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <Target className={cn("h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0", teamColorClass)} />
                      <span className={cn("font-bold text-[10px] sm:text-xs uppercase opacity-70 truncate", teamColorClass)}>
                        {event.team} MEMBER
                      </span>
                    </div>
                    <div className="pl-3 sm:pl-5 flex items-center justify-between gap-2 text-xs sm:text-sm">
                        <span className="truncate">Guessed: <span className="font-bold">{event.guess.word}</span></span>
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs opacity-80 bg-background/50 px-1.5 sm:px-2 py-0.5 rounded-full border border-border/50 shrink-0">
                            {icon} <span className="hidden sm:inline">{status}</span>
                        </span>
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
