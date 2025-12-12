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
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            Live Game Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm italic">
            Waiting for game to start...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/40 backdrop-blur-md border border-white/20 flex flex-col h-full">
      <CardHeader className="pb-3 border-b border-white/10 shrink-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          Live Game Log
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full w-full p-4" ref={scrollRef}>
          <div className="space-y-3">
            {history.map((event, index) => {
              const isRed = event.team === "red"
              const modelName = isRed ? redModelName : blueModelName
              const teamColorClass = isRed ? "text-[var(--red-team)]" : "text-[var(--blue-team)]"
              const bgClass = isRed ? "bg-[var(--red-team)]/5" : "bg-[var(--blue-team)]/5"
              const borderClass = isRed ? "border-[var(--red-team)]/20" : "border-[var(--blue-team)]/20"

              if (event.phase === "spymaster" && event.clue) {
                return (
                  <div key={index} className={cn("p-2 rounded-lg border text-sm", bgClass, borderClass)}>
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className={cn("h-3 w-3", teamColorClass)} />
                      <span className={cn("font-bold text-xs uppercase opacity-70", teamColorClass)}>
                        {event.team} LEADER ({modelName})
                      </span>
                    </div>
                    <div className="font-mono font-medium pl-5">
                      Gives clue: <span className="font-bold">{event.clue.word}</span> <span className="bg-primary/10 px-1.5 py-0.5 rounded text-xs">{event.clue.count}</span>
                    </div>
                  </div>
                )
              }

              if (event.phase === "operative" && event.guess) {
                 let icon = <CheckCircle2 className="h-3 w-3 text-green-500" />
                 let status = "Correct"
                 
                 if (event.guess.type === "assassin") {
                     icon = <AlertCircle className="h-3 w-3 text-[var(--assassin)]" />
                     status = "ASSASSIN!"
                 } else if (event.guess.type !== event.team) {
                     icon = <XCircle className="h-3 w-3 text-muted-foreground" />
                     status = "Miss"
                 }

                return (
                  <div key={index} className={cn("p-2 rounded-lg border text-sm ml-4", "bg-card/50", "border-border/50")}>
                     <div className="flex items-center gap-2 mb-1">
                      <Target className={cn("h-3 w-3", teamColorClass)} />
                      <span className={cn("font-bold text-xs uppercase opacity-70", teamColorClass)}>
                        {event.team} MEMBER ({modelName})
                      </span>
                    </div>
                    <div className="pl-5 flex items-center justify-between">
                        <span>Guessed: <span className="font-bold">{event.guess.word}</span></span>
                        <span className="flex items-center gap-1 text-xs opacity-80 bg-background/50 px-2 py-0.5 rounded-full border border-border/50">
                            {icon} {status}
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
