"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ModelStat } from "@/lib/storage"
import { AI_MODELS } from "@/lib/ai-service"
import { Trophy, Crown } from "lucide-react"

interface LeaderboardProps {
    stats: ModelStat[]
}

export function Leaderboard({ stats }: LeaderboardProps) {
    return (
        <Card className="bg-card border-2 border-amber-500/30 shadow-xl">
            <CardHeader className="p-4 pb-3 border-b border-amber-500/20 bg-amber-500/5">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg shadow-lg">
                        <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-amber-600 dark:text-amber-400">
                        Global Model Performance
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                    {stats.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                            No matches recorded yet
                        </div>
                    ) : (
                        stats.map((stat, index) => {
                            const modelName = AI_MODELS[stat.modelId]?.name || stat.modelId
                            const isTop3 = index < 3
                            
                            return (
                                <div 
                                    key={stat.modelId} 
                                    className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-all duration-200 group ${
                                        isTop3 ? 'bg-muted/30' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Rank Badge */}
                                        <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg transition-transform group-hover:scale-110 ${
                                            index === 0 ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white" :
                                            index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800" :
                                            index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white" :
                                            "bg-muted text-muted-foreground border-2 border-border"
                                        }`}>
                                            {index === 0 && <Crown className="h-4 w-4 absolute -top-2 -right-2 text-yellow-400" />}
                                            {index + 1}
                                        </div>
                                        
                                        {/* Model Info */}
                                        <div>
                                            <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                                {modelName}
                                            </div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                <span className="text-green-600 dark:text-green-500 font-semibold">{stat.wins}W</span>
                                                <span>·</span>
                                                <span className="text-red-600 dark:text-red-400 font-semibold">{stat.losses}L</span>
                                                <span>·</span>
                                                <span>{stat.total} games</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Win Rate */}
                                    <div className="flex items-center gap-2">
                                        <div className={`text-base font-bold px-3 py-1.5 rounded-lg shadow-sm border-2 ${
                                            stat.winRate >= 60 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600' :
                                            stat.winRate >= 50 ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50' :
                                            stat.winRate >= 40 ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50' :
                                            'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50'
                                        }`}>
                                            {stat.winRate.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
