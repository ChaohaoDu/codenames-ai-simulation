import fs from "fs/promises"
import path from "path"

const DB_PATH = path.join(process.cwd(), "data", "matches.json")

export interface MatchRecord {
    id: string
    timestamp: number
    redModelId: string
    blueModelId: string
    winner: "red" | "blue"
    turns: number
}

async function ensureDb() {
    try {
        await fs.access(DB_PATH)
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify([]))
    }
}

export async function getMatches(): Promise<MatchRecord[]> {
    await ensureDb()
    const data = await fs.readFile(DB_PATH, "utf-8")
    return JSON.parse(data)
}

export async function saveMatch(match: Omit<MatchRecord, "id" | "timestamp">) {
    await ensureDb()
    const matches = await getMatches()
    const newMatch: MatchRecord = {
        ...match,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
    }
    matches.push(newMatch)
    await fs.writeFile(DB_PATH, JSON.stringify(matches, null, 2))
    return newMatch
}

export interface ModelStat {
    modelId: string
    wins: number
    losses: number
    total: number
    winRate: number
}

export async function getLeaderboard(): Promise<ModelStat[]> {
    const matches = await getMatches()
    const stats: Record<string, { wins: number; matches: number }> = {}

    matches.forEach(match => {
        // Initialize if not exists
        if (!stats[match.redModelId]) stats[match.redModelId] = { wins: 0, matches: 0 }
        if (!stats[match.blueModelId]) stats[match.blueModelId] = { wins: 0, matches: 0 }

        // Update matches count
        stats[match.redModelId].matches++
        stats[match.blueModelId].matches++

        // Update wins
        if (match.winner === "red") {
            stats[match.redModelId].wins++
        } else {
            stats[match.blueModelId].wins++
        }
    })

    return Object.entries(stats).map(([modelId, data]) => ({
        modelId,
        wins: data.wins,
        losses: data.matches - data.wins,
        total: data.matches,
        winRate: data.matches > 0 ? (data.wins / data.matches) * 100 : 0
    })).sort((a, b) => b.winRate - a.winRate)
}
