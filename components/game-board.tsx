"use client"

import type { Card } from "@/lib/types"
import { GameCard } from "./game-card"

interface GameBoardProps {
  board: Card[]
  showIdentity: boolean
  onCardClick?: (index: number) => void
  disabled?: boolean
}

export function GameBoard({ board, showIdentity, onCardClick, disabled }: GameBoardProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {board.map((card, index) => (
          <GameCard
            key={`${card.word}-${index}`}
            card={card}
            showIdentity={showIdentity}
            onClick={() => onCardClick?.(index)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  )
}
