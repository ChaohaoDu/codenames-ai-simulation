import { GameView } from "@/components/game-view"
import { initializeGame } from "@/lib/game-engine"

export default function Home() {
  const initialGameState = initializeGame("red")

  return <GameView initialGameState={initialGameState} />
}
