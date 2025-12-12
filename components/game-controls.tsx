import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AI_MODELS, AVAILABLE_MODELS } from "@/lib/ai-service"
import { Pause, Play, RotateCcw, Zap } from "lucide-react"

interface GameControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onReset: () => void
  redModelId: string
  onRedModelChange: (modelId: string) => void
  blueModelId: string
  onBlueModelChange: (modelId: string) => void
}

export function GameControls({
  isPlaying,
  onPlayPause,
  onReset,
  redModelId,
  onRedModelChange,
  blueModelId,
  onBlueModelChange,
}: GameControlsProps) {
  return (
    <div className="w-full bg-card/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        


        {/* Red Team Model */}
        <div className="space-y-2">
           <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--red-team)]">Red Team Agent</Label>
           <Select value={redModelId} onValueChange={onRedModelChange} disabled={isPlaying}>
            <SelectTrigger className="w-full bg-background/50 border-[var(--red-team)]/30 focus:ring-[var(--red-team)]/30">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AI_MODELS).map(([key, model]) => (
                <SelectItem key={key} value={key}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

         {/* Blue Team Model */}
         <div className="space-y-2">
           <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--blue-team)]">Blue Team Agent</Label>
           <Select value={blueModelId} onValueChange={onBlueModelChange} disabled={isPlaying}>
            <SelectTrigger className="w-full bg-background/50 border-[var(--blue-team)]/30 focus:ring-[var(--blue-team)]/30">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AI_MODELS).map(([key, model]) => (
                <SelectItem key={key} value={key}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Playback Controls */}
        <div className="md:col-span-2 flex items-center gap-4">
            <Button 
                onClick={onPlayPause} 
                className={`flex-1 h-10 font-semibold shadow-md transition-all ${isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-[1.02]'}`}
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2 fill-current" />}
              {isPlaying ? "Pause" : "Start Game"}
            </Button>
            
            <Button onClick={onReset} variant="outline" size="icon" className="h-10 w-10 border-2 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-colors">
              <RotateCcw className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  )
}
