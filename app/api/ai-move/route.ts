import { getOperativeGuess, getSpymasterClue } from "@/lib/ai-service"
import type { GameState } from "@/lib/types"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gameState, modelId } = body as {
      gameState: GameState
      modelId: string
    }

    if (gameState.currentPhase === "spymaster") {
      const clue = await getSpymasterClue(gameState, gameState.currentTeam, modelId)

      return NextResponse.json({ type: "clue", clue })
    } else {
      const guess = await getOperativeGuess(gameState, gameState.currentTeam, gameState.currentClue!, modelId)

      return NextResponse.json({ type: "guess", guess })
    }
  } catch (error) {
    console.error("[v0] AI move API error:", error)
    return NextResponse.json({ error: "Failed to get AI move" }, { status: 500 })
  }
}
