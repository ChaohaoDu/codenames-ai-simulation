import { generateText } from "ai"
import type { Clue, GameState, TeamType } from "./types"

export interface AIModelConfig {
  name: string
  modelId: string
}

export const AI_MODELS: Record<string, AIModelConfig> = {
  "gpt-4o": {
    name: "GPT-4o",
    modelId: "openai/gpt-4o",
  },
  "claude-3-sonnet": {
    name: "Claude Sonnet",
    modelId: "anthropic/claude-3-5-sonnet",
  },
  "gemini-pro": {
    name: "Gemini Pro",
    modelId: "google/gemini-1.5-pro",
  },
  "llama-3": {
    name: "Llama 3",
    modelId: "meta/llama-3.1-70b-instruct",
  },
  "mistral": {
    name: "Mistral",
    modelId: "mistralai/mistral-large",
  },
  "grok": {
    name: "Grok",
    modelId: "xai/grok-beta",
  },
}

export const AVAILABLE_MODELS = Object.values(AI_MODELS)

function getBoardContext(state: GameState, team: TeamType): string {
  const teamWords = state.board.filter((card) => card.type === team && !card.revealed).map((card) => card.word)

  const opponentTeam = team === "red" ? "blue" : "red"
  const opponentWords = state.board
    .filter((card) => card.type === opponentTeam && !card.revealed)
    .map((card) => card.word)

  const neutralWords = state.board.filter((card) => card.type === "neutral" && !card.revealed).map((card) => card.word)

  const assassinWord = state.board.find((card) => card.type === "assassin" && !card.revealed)?.word

  const revealedWords = state.board.filter((card) => card.revealed).map((card) => card.word)

  return `
Your team (${team}): ${teamWords.join(", ")}
Opponent team (${opponentTeam}): ${opponentWords.join(", ")}
Neutral words: ${neutralWords.join(", ")}
Assassin word: ${assassinWord || "REVEALED"}
Already revealed: ${revealedWords.join(", ")}
  `.trim()
}

export async function getSpymasterClue(state: GameState, team: TeamType, modelId: string): Promise<Clue> {
  const boardContext = getBoardContext(state, team)
  const allWords = state.board.map((card) => card.word)

  const prompt = `You are the Spymaster for the ${team.toUpperCase()} team in a game of Codenames.

BOARD STATE:
${boardContext}

RULES:
- Give a one-word clue that relates to YOUR team's words
- The clue MUST NOT be any word on the board: ${allWords.join(", ")}
- Include a number (1-9) indicating how many of your team's words relate to the clue
- Avoid words that might lead to the ASSASSIN or opponent's words
- Be strategic: more words = more risk but faster win

OUTPUT FORMAT (respond ONLY with this format, no explanation):
CLUE: [your one-word clue]
COUNT: [number from 1-9]`

  try {
    const { text } = await generateText({
      model: modelId,
      prompt,
      temperature: 0.8,
    })

    const clueMatch = text.match(/CLUE:\s*(\w+)/i)
    const countMatch = text.match(/COUNT:\s*(\d+)/i)

    const word = clueMatch?.[1]?.toUpperCase() || "STRATEGY"
    const count = countMatch?.[1] ? Number.parseInt(countMatch[1], 10) : 1

    return {
      word,
      count: Math.min(Math.max(count, 1), 9),
      team,
    }
  } catch (error) {
    console.error("[v0] AI Spymaster error:", error)
    return { word: "STRATEGY", count: 1, team }
  }
}

export async function getOperativeGuess(
  state: GameState,
  team: TeamType,
  clue: Clue,
  modelId: string,
): Promise<string> {
  const unrevealedWords = state.board.filter((card) => !card.revealed).map((card) => card.word)

  const revealedWords = state.board.filter((card) => card.revealed).map((card) => `${card.word} (${card.type})`)

  const prompt = `You are an Operative for the ${team.toUpperCase()} team in Codenames.

Your Spymaster gave you this clue:
CLUE: ${clue.word}
COUNT: ${clue.count}

AVAILABLE WORDS (unrevealed):
${unrevealedWords.join(", ")}

ALREADY REVEALED:
${revealedWords.join(", ")}

Choose ONE word from the available words that best matches the clue "${clue.word}".
Consider:
- The clue relates to ${clue.count} of your team's words
- Avoid the assassin at all costs
- Think about word associations and meanings

OUTPUT FORMAT (respond ONLY with this format):
GUESS: [one word from available words]`

  try {
    const { text } = await generateText({
      model: modelId,
      prompt,
      temperature: 0.7,
    })

    const guessMatch = text.match(/GUESS:\s*(\w+)/i)
    const guess = guessMatch?.[1]?.toUpperCase()

    // Validate guess is on board
    if (guess && unrevealedWords.includes(guess)) {
      return guess
    }

    // Fallback to random unrevealed word
    return unrevealedWords[Math.floor(Math.random() * unrevealedWords.length)]
  } catch (error) {
    console.error("[v0] AI Operative error:", error)
    const unrevealedWords = state.board.filter((card) => !card.revealed).map((card) => card.word)
    return unrevealedWords[Math.floor(Math.random() * unrevealedWords.length)]
  }
}
