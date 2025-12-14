import { NextResponse } from "next/server"
import { getLeaderboard, saveMatch } from "@/lib/db"

export async function GET() {
    try {
        const leaderboard = await getLeaderboard()
        return NextResponse.json({ leaderboard })
    } catch (error) {
        console.error('GET /api/stats error:', error)
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { redModelId, blueModelId, winner, turns } = body
        
        await saveMatch({
            redModelId,
            blueModelId,
            winner,
            turns
        })
        
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('POST /api/stats error:', error)
        return NextResponse.json({ error: "Failed to save match" }, { status: 500 })
    }
}
