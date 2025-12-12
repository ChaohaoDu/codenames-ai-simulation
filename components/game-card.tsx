"use client"

import { cn } from "@/lib/utils"
import type { Card } from "@/lib/types"

interface GameCardProps {
  card: Card
  showIdentity: boolean
  onClick?: () => void
  disabled?: boolean
}

export function GameCard({ card, showIdentity, onClick, disabled }: GameCardProps) {
  const getCardColor = () => {
    if (!showIdentity && !card.revealed) {
      return "bg-card border-border"
    }

    if (card.revealed) {
      switch (card.type) {
        case "red":
          return "bg-[var(--red-team)] border-[var(--red-team)]"
        case "blue":
          return "bg-[var(--blue-team)] border-[var(--blue-team)]"
        case "neutral":
          return "bg-[var(--neutral)] border-[var(--neutral)]"
        case "assassin":
          return "bg-[var(--assassin)] border-[var(--assassin)]"
      }
    }

    // Show identity but not revealed
    switch (card.type) {
      case "red":
        return "bg-card border-[var(--red-team)]"
      case "blue":
        return "bg-card border-[var(--blue-team)]"
      case "neutral":
        return "bg-card border-[var(--neutral)]"
      case "assassin":
        return "bg-card border-[var(--assassin)]"
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || card.revealed}
      className={cn(
        "relative flex aspect-[2.5/1] items-center justify-center rounded-lg border-2 p-2 text-center font-semibold transition-all shadow-sm",
        getCardColor(),
        !disabled && !card.revealed && "hover:scale-105 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        card.revealed && "opacity-90 contrast-125",
        disabled && "cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "text-xs font-bold leading-tight tracking-tight md:text-sm transition-colors uppercase truncate w-full px-1",
          card.revealed && ["red", "blue", "assassin"].includes(card.type) ? "text-white drop-shadow-sm" : "text-foreground",
          card.revealed && card.type === "neutral" && "text-foreground/70"
        )}
      >
        {card.type === "assassin" && "💣 "}{card.word}
      </span>
      {card.revealed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="h-full w-full border-2 border-foreground/20 rounded-lg" />
        </div>
      )}
    </button>
  )
}
