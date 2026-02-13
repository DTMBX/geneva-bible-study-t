import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Share, BookmarkSimple, Copy, Check, ChatCircle, UsersThree, Heart } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { fetchVerse } from '@/lib/bibleApi'
import { bibleBooks } from '@/lib/data'
import type { Bookmark, Conversation, UserConnection, GroupDiscussion } from '@/lib/types'

interface VerseOfTheDayData {
  date: string
  bookId: string
  chapter: number
  verse: number
  text: string
  translation: string
}

interface VerseOfTheDayProps {
  userProfile: any
  onNavigateToReader?: (bookId: string, chapter: number) => void
  onNavigateToMessages?: (friendId: string, verseRef: any) => void
}

export default function VerseOfTheDay({ userProfile, onNavigateToReader, onNavigateToMessages }: VerseOfTheDayProps) {
  const [verseData, setVerseData] = useState<VerseOfTheDayData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [bookmarks = [], setBookmarks] = useKV<Bookmark[]>('bookmarks', [])
  const [friends = []] = useKV<UserConnection[]>('friends', [])
  const [conversations = [], setConversations] = useKV<Conversation[]>('conversations', [])
  const [groups = []] = useKV<GroupDiscussion[]>('group-discussions', [])
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [likedVerses = [], setLikedVerses] = useKV<string[]>('liked-verses-of-day', [])

  useEffect(() => {
    const fetchUser = async () => {
      const user = await window.spark.user()
      setCurrentUserId(user?.id?.toString() || 'anonymous')
    }
    fetchUser()
  }, [])

  useEffect(() => {
    loadVerseOfTheDay()
  }, [])

  const loadVerseOfTheDay = async () => {
    setIsLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const [cachedVerse] = await window.spark.kv.get<VerseOfTheDayData>(`verse-of-day-${today}`) as any

      if (cachedVerse) {
        setVerseData(cachedVerse)
        setIsLoading(false)
        return
      }

      const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
      
      const inspirationalVerses = [
        { bookId: 'jhn', chapter: 3, verse: 16 },
        { bookId: 'psa', chapter: 23, verse: 1 },
        { bookId: 'pro', chapter: 3, verse: 5 },
        { bookId: 'isa', chapter: 41, verse: 10 },
        { bookId: 'mat', chapter: 6, verse: 33 },
        { bookId: 'rom', chapter: 8, verse: 28 },
        { bookId: 'php', chapter: 4, verse: 13 },
        { bookId: 'jer', chapter: 29, verse: 11 },
        { bookId: '1co', chapter: 13, verse: 4 },
        { bookId: 'psa', chapter: 46, verse: 1 },
        { bookId: 'mat', chapter: 11, verse: 28 },
        { bookId: 'isa', chapter: 40, verse: 31 },
        { bookId: 'rom', chapter: 12, verse: 2 },
        { bookId: 'eph', chapter: 2, verse: 8 },
        { bookId: 'psa', chapter: 119, verse: 105 },
        { bookId: '2ti', chapter: 1, verse: 7 },
        { bookId: 'heb', chapter: 11, verse: 1 },
        { bookId: 'jas', chapter: 1, verse: 2 },
        { bookId: '1pe', chapter: 5, verse: 7 },
        { bookId: 'rev', chapter: 21, verse: 4 },
        { bookId: 'psa', chapter: 27, verse: 1 },
        { bookId: 'pro', chapter: 16, verse: 3 },
        { bookId: 'mat', chapter: 5, verse: 16 },
        { bookId: 'jhn', chapter: 14, verse: 6 },
        { bookId: 'gal', chapter: 5, verse: 22 },
        { bookId: 'col', chapter: 3, verse: 23 },
        { bookId: '1jn', chapter: 4, verse: 19 },
        { bookId: 'psa', chapter: 37, verse: 4 },
        { bookId: 'isa', chapter: 26, verse: 3 },
        { bookId: 'mic', chapter: 6, verse: 8 }
      ]

      const selectedVerse = inspirationalVerses[dayOfYear % inspirationalVerses.length]
      const translation = userProfile?.preferences?.defaultTranslation || 'kjv'

      const verseResult = await fetchVerse({
        translationId: translation,
        bookId: selectedVerse.bookId,
        chapter: selectedVerse.chapter,
        verse: selectedVerse.verse
      })

      if (!verseResult) {
        throw new Error('Failed to fetch verse')
      }

      const newVerseData: VerseOfTheDayData = {
        date: today,
        bookId: selectedVerse.bookId,
        chapter: selectedVerse.chapter,
        verse: selectedVerse.verse,
        text: verseResult.text,
        translation: translation
      }

      await window.spark.kv.set(`verse-of-day-${today}`, newVerseData)
      setVerseData(newVerseData)
    } catch (error) {
      console.error('Failed to load verse of the day:', error)
      toast.error('Failed to load verse of the day')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyVerse = () => {
    if (!verseData) return
    
    const book = bibleBooks.find(b => b.id === verseData.bookId)
    const text = `"${verseData.text}"\n\n${book?.title} ${verseData.chapter}:${verseData.verse} (${verseData.translation.toUpperCase()})`
    
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Verse copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBookmark = () => {
    if (!verseData) return
    
    const book = bibleBooks.find(b => b.id === verseData.bookId)
    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      userId: currentUserId,
      verseId: `${verseData.bookId}-${verseData.chapter}-${verseData.verse}`,
      workId: verseData.bookId,
      chapterNumber: verseData.chapter,
      verseNumber: verseData.verse,
      label: `Verse of the Day - ${new Date().toLocaleDateString()}`,
      createdAt: Date.now()
    }
    
    setBookmarks((current = []) => [newBookmark, ...current])
    toast.success('Verse bookmarked')
  }

  const handleLike = () => {
    if (!verseData) return
    const verseKey = `${verseData.date}-${verseData.bookId}-${verseData.chapter}-${verseData.verse}`
    
    setLikedVerses((current = []) => {
      if (current.includes(verseKey)) {
        toast.success('Removed from favorites')
        return current.filter(v => v !== verseKey)
      } else {
        toast.success('Added to favorites')
        return [...current, verseKey]
      }
    })
  }

  const handleShareWithFriend = (friend: UserConnection) => {
    if (!verseData) return
    
    const book = bibleBooks.find(b => b.id === verseData.bookId)
    const verseRef = {
      bookId: verseData.bookId,
      bookName: book?.title,
      chapter: verseData.chapter,
      verse: verseData.verse,
      text: verseData.text,
      translation: verseData.translation
    }

    if (onNavigateToMessages) {
      onNavigateToMessages(friend.userId, verseRef)
      setShareDialogOpen(false)
      toast.success(`Opening chat with ${friend.userName}`)
    }
  }

  const handleShareWithGroup = (group: GroupDiscussion) => {
    if (!verseData) return
    
    const book = bibleBooks.find(b => b.id === verseData.bookId)
    const message = `📖 Verse of the Day:\n\n"${verseData.text}"\n\n${book?.title} ${verseData.chapter}:${verseData.verse} (${verseData.translation.toUpperCase()})`
    
    toast.success(`Shared with ${group.name}`)
    setShareDialogOpen(false)
  }

  const handleReadInContext = () => {
    if (!verseData || !onNavigateToReader) return
    onNavigateToReader(verseData.bookId, verseData.chapter)
  }

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookmarkSimple size={24} weight="duotone" className="text-accent" />
            Verse of the Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/6" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!verseData) return null

  const book = bibleBooks.find(b => b.id === verseData.bookId)
  const verseKey = `${verseData.date}-${verseData.bookId}-${verseData.chapter}-${verseData.verse}`
  const isLiked = likedVerses.includes(verseKey)

  return (
    <>
      <Card className="border-l-4 border-l-accent hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookmarkSimple size={24} weight="duotone" className="text-accent" />
                Verse of the Day
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className="text-accent hover:text-accent"
            >
              {isLiked ? (
                <Heart size={24} weight="fill" className="text-accent" />
              ) : (
                <Heart size={24} weight="duotone" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className="text-lg leading-relaxed cursor-pointer hover:text-accent transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
            onClick={handleReadInContext}
          >
            "{verseData.text}"
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-primary">
              {book?.title} {verseData.chapter}:{verseData.verse}
              <span className="ml-2 text-muted-foreground">({verseData.translation.toUpperCase()})</span>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyVerse}
              className="gap-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              className="gap-2"
            >
              <BookmarkSimple size={16} weight="duotone" />
              Bookmark
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareDialogOpen(true)}
              className="gap-2"
            >
              <Share size={16} weight="duotone" />
              Share
            </Button>

            {onNavigateToReader && (
              <Button
                variant="default"
                size="sm"
                onClick={handleReadInContext}
                className="gap-2 ml-auto"
              >
                Read in Context
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Share Verse of the Day</DialogTitle>
            <DialogDescription>
              Share this inspiring verse with friends or groups
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-md text-sm" style={{ fontFamily: 'var(--font-body)' }}>
              "{verseData.text}"
              <div className="mt-2 text-xs text-muted-foreground">
                — {book?.title} {verseData.chapter}:{verseData.verse}
              </div>
            </div>

            {friends.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Share with Friends</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {friends.map(friend => (
                    <button
                      key={friend.userId}
                      onClick={() => handleShareWithFriend(friend)}
                      className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors text-left"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {friend.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{friend.userName}</p>
                        <p className="text-xs text-muted-foreground">Send via message</p>
                      </div>
                      <ChatCircle size={20} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {groups.filter(g => g.memberIds.includes(currentUserId)).length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Share with Groups</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {groups
                    .filter(g => g.memberIds.includes(currentUserId))
                    .map(group => (
                      <button
                        key={group.id}
                        onClick={() => handleShareWithGroup(group)}
                        className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors text-left"
                      >
                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                          <UsersThree size={20} className="text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{group.name}</p>
                          <p className="text-xs text-muted-foreground">{group.memberIds.length} members</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {friends.length === 0 && groups.filter(g => g.memberIds.includes(currentUserId)).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <UsersThree size={48} weight="duotone" className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No friends or groups to share with</p>
                <p className="text-xs">Add friends to start sharing verses</p>
              </div>
            )}

            <Separator />

            <div>
              <Label className="text-sm font-medium mb-2 block">Quick Actions</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyVerse}
                  className="flex-1 gap-2"
                >
                  <Copy size={16} />
                  Copy Text
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className="flex-1 gap-2"
                >
                  <BookmarkSimple size={16} />
                  Bookmark
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
