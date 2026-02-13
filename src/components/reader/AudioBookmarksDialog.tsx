import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { BookmarkSimple, Play, Trash, NotePencil, Tag, MagnifyingGlass, SortAscending, X } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AudioBookmark } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

interface AudioBookmarksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlayBookmark: (bookmark: AudioBookmark) => void
  currentUserId: string
}

export default function AudioBookmarksDialog({
  open,
  onOpenChange,
  onPlayBookmark,
  currentUserId
}: AudioBookmarksDialogProps) {
  const [bookmarks, setBookmarks] = useKV<AudioBookmark[]>('audio-bookmarks', [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNote, setEditNote] = useState('')
  const [editTags, setEditTags] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'most-played' | 'book'>('recent')

  const userBookmarks = (bookmarks || []).filter(b => b.userId === currentUserId)

  const filteredBookmarks = userBookmarks.filter(bookmark => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      bookmark.bookName.toLowerCase().includes(query) ||
      bookmark.verseText.toLowerCase().includes(query) ||
      bookmark.note?.toLowerCase().includes(query) ||
      bookmark.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  })

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.createdAt - a.createdAt
      case 'oldest':
        return a.createdAt - b.createdAt
      case 'most-played':
        return b.playCount - a.playCount
      case 'book':
        return a.bookName.localeCompare(b.bookName) || a.chapterNumber - b.chapterNumber || a.verseNumber - b.verseNumber
      default:
        return 0
    }
  })

  const handleDeleteBookmark = (bookmarkId: string) => {
    setBookmarks(current => (current || []).filter(b => b.id !== bookmarkId))
  }

  const handleStartEdit = (bookmark: AudioBookmark) => {
    setEditingId(bookmark.id)
    setEditNote(bookmark.note || '')
    setEditTags(bookmark.tags?.join(', ') || '')
  }

  const handleSaveEdit = (bookmarkId: string) => {
    setBookmarks(current => 
      (current || []).map(b => 
        b.id === bookmarkId 
          ? {
              ...b,
              note: editNote || undefined,
              tags: editTags 
                ? editTags.split(',').map(t => t.trim()).filter(t => t.length > 0)
                : undefined
            }
          : b
      )
    )
    setEditingId(null)
    setEditNote('')
    setEditTags('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditNote('')
    setEditTags('')
  }

  const handlePlay = (bookmark: AudioBookmark) => {
    setBookmarks(current =>
      (current || []).map(b =>
        b.id === bookmark.id
          ? {
              ...b,
              lastPlayedAt: Date.now(),
              playCount: b.playCount + 1
            }
          : b
      )
    )
    onPlayBookmark(bookmark)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookmarkSimple size={24} weight="duotone" className="text-primary" />
            Audio Bookmarks
          </DialogTitle>
          <DialogDescription>
            Your saved audio moments from Bible readings
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
              />
              <Input
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[160px]">
                <SortAscending size={18} className="mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most-played">Most Played</SelectItem>
                <SelectItem value="book">By Book</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sortedBookmarks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BookmarkSimple size={48} weight="duotone" className="mx-auto mb-2 opacity-50" />
                <p className="font-medium">No bookmarks yet</p>
                <p className="text-sm">Save favorite audio moments while listening</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-3">
                {sortedBookmarks.map((bookmark) => (
                  <Card key={bookmark.id} className="p-4">
                    <div className="flex gap-3">
                      <Button
                        size="icon"
                        onClick={() => handlePlay(bookmark)}
                        className="shrink-0"
                      >
                        <Play size={20} weight="fill" />
                      </Button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold text-sm">
                              {bookmark.bookName} {bookmark.chapterNumber}:{bookmark.verseNumber}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {bookmark.narratorName} • {bookmark.playbackRate}x speed • {bookmark.translation}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {editingId !== bookmark.id && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleStartEdit(bookmark)}
                                >
                                  <NotePencil size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteBookmark(bookmark.id)}
                                >
                                  <Trash size={16} />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-foreground/90 mb-2 line-clamp-2">
                          "{bookmark.verseText}"
                        </p>

                        {editingId === bookmark.id ? (
                          <div className="flex flex-col gap-2 mt-3">
                            <Textarea
                              placeholder="Add a note..."
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              className="min-h-[60px]"
                            />
                            <Input
                              placeholder="Tags (comma-separated)"
                              value={editTags}
                              onChange={(e) => setEditTags(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(bookmark.id)}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {bookmark.note && (
                              <p className="text-sm text-muted-foreground italic mb-2">
                                {bookmark.note}
                              </p>
                            )}
                            {bookmark.tags && bookmark.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap mb-2">
                                {bookmark.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    <Tag size={12} className="mr-1" weight="fill" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </>
                        )}

                        <Separator className="my-2" />

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            Saved {formatDistanceToNow(bookmark.createdAt, { addSuffix: true })}
                          </span>
                          <div className="flex items-center gap-3">
                            {bookmark.lastPlayedAt && (
                              <span>
                                Last played {formatDistanceToNow(bookmark.lastPlayedAt, { addSuffix: true })}
                              </span>
                            )}
                            <span>
                              Played {bookmark.playCount} {bookmark.playCount === 1 ? 'time' : 'times'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
