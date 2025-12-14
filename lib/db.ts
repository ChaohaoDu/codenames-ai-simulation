import { sql } from '@vercel/postgres'

export interface MatchRecord {
    id: string
    timestamp: number
    redModelId: string
    blueModelId: string
    winner: "red" | "blue"
    turns: number
}

export interface ModelStat {
    modelId: string
    wins: number
    losses: number
    total: number
    winRate: number
}

/**
 * Initialize database tables
 */
export async function initializeDatabase() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS matches (
                id TEXT PRIMARY KEY,
                timestamp BIGINT NOT NULL,
                red_model_id TEXT NOT NULL,
                blue_model_id TEXT NOT NULL,
                winner TEXT NOT NULL CHECK (winner IN ('red', 'blue')),
                turns INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `
        
        await sql`
            CREATE INDEX IF NOT EXISTS idx_matches_timestamp ON matches(timestamp DESC)
        `
        
        await sql`
            CREATE INDEX IF NOT EXISTS idx_matches_models ON matches(red_model_id, blue_model_id)
        `
        
        console.log('Database initialized successfully')
    } catch (error) {
        console.error('Database initialization error:', error)
        throw error
    }
}

/**
 * Get all matches from database
 */
export async function getMatches(): Promise<MatchRecord[]> {
    try {
        const { rows } = await sql`
            SELECT 
                id,
                timestamp,
                red_model_id as "redModelId",
                blue_model_id as "blueModelId",
                winner,
                turns
            FROM matches
            ORDER BY timestamp DESC
        `
        return rows as MatchRecord[]
    } catch (error) {
        console.error('Error fetching matches:', error)
        return []
    }
}

/**
 * Save a new match to database
 */
export async function saveMatch(match: Omit<MatchRecord, "id" | "timestamp">): Promise<MatchRecord> {
    const newMatch: MatchRecord = {
        ...match,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
    }
    
    try {
        await sql`
            INSERT INTO matches (id, timestamp, red_model_id, blue_model_id, winner, turns)
            VALUES (
                ${newMatch.id},
                ${newMatch.timestamp},
                ${newMatch.redModelId},
                ${newMatch.blueModelId},
                ${newMatch.winner},
                ${newMatch.turns}
            )
        `
        return newMatch
    } catch (error) {
        console.error('Error saving match:', error)
        throw error
    }
}

/**
 * Get leaderboard statistics for all models
 */
export async function getLeaderboard(): Promise<ModelStat[]> {
    try {
        // Get stats for red team
        const redStats = await sql`
            SELECT 
                red_model_id as model_id,
                COUNT(*) as total_matches,
                SUM(CASE WHEN winner = 'red' THEN 1 ELSE 0 END) as wins
            FROM matches
            GROUP BY red_model_id
        `
        
        // Get stats for blue team
        const blueStats = await sql`
            SELECT 
                blue_model_id as model_id,
                COUNT(*) as total_matches,
                SUM(CASE WHEN winner = 'blue' THEN 1 ELSE 0 END) as wins
            FROM matches
            GROUP BY blue_model_id
        `
        
        // Combine stats
        const statsMap: Record<string, { wins: number; matches: number }> = {}
        
        redStats.rows.forEach((row: any) => {
            if (!statsMap[row.model_id]) {
                statsMap[row.model_id] = { wins: 0, matches: 0 }
            }
            statsMap[row.model_id].matches += Number(row.total_matches)
            statsMap[row.model_id].wins += Number(row.wins)
        })
        
        blueStats.rows.forEach((row: any) => {
            if (!statsMap[row.model_id]) {
                statsMap[row.model_id] = { wins: 0, matches: 0 }
            }
            statsMap[row.model_id].matches += Number(row.total_matches)
            statsMap[row.model_id].wins += Number(row.wins)
        })
        
        // Convert to array and sort
        return Object.entries(statsMap)
            .map(([modelId, data]) => ({
                modelId,
                wins: data.wins,
                losses: data.matches - data.wins,
                total: data.matches,
                winRate: data.matches > 0 ? (data.wins / data.matches) * 100 : 0
            }))
            .sort((a, b) => b.winRate - a.winRate)
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        return []
    }
}
