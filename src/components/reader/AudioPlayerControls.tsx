import { Play, Pause, Stop, SpeakerHigh, CaretRight, CaretLeft } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { AudioNarrator, AudioPlaybackState } from '@/lib/types'

interface AudioPlayerControlsProps {
  playbackState: AudioPlaybackState
  currentNarrator: AudioNarrator | undefined
  narrators: AudioNarrator[]
  onPlay: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onNarratorChange: (narratorId: string) => void
  onPlaybackRateChange: (rate: number) => void
  onVolumeChange: (volume: number) => void
  totalVerses: number
}

export default function AudioPlayerControls({
  playbackState,
  currentNarrator,
  narrators,
  onPlay,
  onPause,
  onResume,
  onStop,
  onNarratorChange,
  onPlaybackRateChange,
  onVolumeChange,
  totalVerses
}: AudioPlayerControlsProps) {
  const handlePlayPause = () => {
    if (playbackState.isPlaying) {
      onPause()
    } else if (playbackState.isPaused) {
      onResume()
    } else {
      onPlay()
    }
  }

  return (
    <Card className="p-4 bg-card border-primary/20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SpeakerHigh size={24} weight="duotone" className="text-primary" />
            <div className="flex flex-col">
              <h3 className="font-semibold text-sm">Audio Bible</h3>
              {playbackState.isPlaying && playbackState.currentVerseNumber > 0 && (
                <span className="text-xs text-muted-foreground">
                  Verse {playbackState.currentVerseNumber} of {totalVerses}
                </span>
              )}
            </div>
          </div>
          {currentNarrator && (
            <Badge variant="secondary" className="text-xs">
              {currentNarrator.name}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={playbackState.isPlaying || playbackState.isPaused ? "default" : "default"}
            size="icon"
            onClick={handlePlayPause}
            className="h-12 w-12"
          >
            {playbackState.isPlaying ? (
              <Pause size={24} weight="fill" />
            ) : (
              <Play size={24} weight="fill" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onStop}
            disabled={!playbackState.isPlaying && !playbackState.isPaused}
          >
            <Stop size={20} weight="fill" />
          </Button>

          <Separator orientation="vertical" className="h-10 mx-2" />

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground min-w-[60px]">Narrator:</span>
              <Select
                value={playbackState.narratorId}
                onValueChange={onNarratorChange}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {narrators.map((narrator) => (
                    <SelectItem key={narrator.id} value={narrator.id}>
                      <div className="flex items-center gap-2">
                        <span>{narrator.name}</span>
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {narrator.accent}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground min-w-[60px]">Speed:</span>
              <div className="flex-1 flex items-center gap-2">
                <Slider
                  value={[playbackState.playbackRate]}
                  onValueChange={([value]) => onPlaybackRateChange(value)}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                  {playbackState.playbackRate.toFixed(1)}x
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SpeakerHigh size={16} className="text-muted-foreground min-w-[60px]" />
              <div className="flex-1 flex items-center gap-2">
                <Slider
                  value={[playbackState.volume * 100]}
                  onValueChange={([value]) => onVolumeChange(value / 100)}
                  min={0}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground min-w-[40px] text-right">
                  {Math.round(playbackState.volume * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {currentNarrator && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            {currentNarrator.description}
          </div>
        )}
      </div>
    </Card>
  )
}
