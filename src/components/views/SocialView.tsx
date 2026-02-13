import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Users, Heart, ChatCircle, ShareNetwork, Trophy, BookOpen, CalendarCheck } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import type { SharedVerse, SharedProgress } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

export default function SocialView() {
  const [sharedVerses = []] = useKV<SharedVerse[]>('shared-verses', [])
  const [sharedProgress = []] = useKV<SharedProgress[]>('shared-progress', [])
  const [likedItems, setLikedItems] = useKV<string[]>('liked-items', [])
  const [commentText, setCommentText] = useState<Record<string, string>>({})

  const allShares = [...sharedVerses, ...sharedProgress].sort((a, b) => b.createdAt - a.createdAt)

  const handleLike = async (itemId: string) => {
    const user = await window.spark.user()
    const userId = user?.id?.toString() || 'anonymous'

    setLikedItems((current = []) => {
      if (current.includes(itemId)) {
        return current.filter(id => id !== itemId)
      } else {
        return [...current, itemId]
      }
    })
  }

  const isVerse = (item: SharedVerse | SharedProgress): item is SharedVerse => {
    return 'verseText' in item
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b bg-card px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <Users size={28} weight="duotone" className="text-primary" />
            Social Feed
          </h2>
          <p className="text-muted-foreground">
            Share verses, celebrate milestones, and encourage one another
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <div className="border-b bg-card px-6 py-2">
          <TabsList className="max-w-3xl mx-auto">
            <TabsTrigger value="all">All Updates</TabsTrigger>
            <TabsTrigger value="verses">Verses</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <TabsContent value="all" className="mt-0">
                {allShares.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Users size={64} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No shares yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Share your favorite verses and reading progress to get started!
                    </p>
                  </Card>
                ) : (
                  allShares.map((item) => (
                    <ShareCard
                      key={item.id}
                      item={item}
                      isLiked={likedItems?.includes(item.id) || false}
                      onLike={() => handleLike(item.id)}
                      commentText={commentText[item.id] || ''}
                      onCommentChange={(text) => setCommentText({ ...commentText, [item.id]: text })}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="verses" className="mt-0">
                {sharedVerses.length === 0 ? (
                  <Card className="p-12 text-center">
                    <BookOpen size={64} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No verses shared</h3>
                    <p className="text-muted-foreground">
                      Share inspiring verses from your reading
                    </p>
                  </Card>
                ) : (
                  sharedVerses.map((verse) => (
                    <ShareCard
                      key={verse.id}
                      item={verse}
                      isLiked={likedItems?.includes(verse.id) || false}
                      onLike={() => handleLike(verse.id)}
                      commentText={commentText[verse.id] || ''}
                      onCommentChange={(text) => setCommentText({ ...commentText, [verse.id]: text })}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="progress" className="mt-0">
                {sharedProgress.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Trophy size={64} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No progress shared</h3>
                    <p className="text-muted-foreground">
                      Complete reading plans and celebrate milestones
                    </p>
                  </Card>
                ) : (
                  sharedProgress.map((progress) => (
                    <ShareCard
                      key={progress.id}
                      item={progress}
                      isLiked={likedItems?.includes(progress.id) || false}
                      onLike={() => handleLike(progress.id)}
                      commentText={commentText[progress.id] || ''}
                      onCommentChange={(text) => setCommentText({ ...commentText, [progress.id]: text })}
                    />
                  ))
                )}
              </TabsContent>
            </div>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

interface ShareCardProps {
  item: SharedVerse | SharedProgress
  isLiked: boolean
  onLike: () => void
  commentText: string
  onCommentChange: (text: string) => void
}

function ShareCard({ item, isLiked, onLike }: ShareCardProps) {
  const isVerse = 'verseText' in item

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={item.userAvatar} />
            <AvatarFallback>{item.userName[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold">{item.userName}</p>
              {isVerse ? (
                <Badge variant="secondary" className="text-xs">
                  <BookOpen size={12} weight="duotone" className="mr-1" />
                  Verse
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs bg-accent/20 text-accent-foreground">
                  <Trophy size={12} weight="duotone" className="mr-1" />
                  Achievement
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(item.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isVerse ? (
          <>
            <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-l-primary">
              <p className="text-sm font-mono text-muted-foreground mb-2">
                {item.bookName} {item.chapterNumber}:{item.verseNumber}
                {item.verseEndNumber && item.verseEndNumber !== item.verseNumber && `-${item.verseEndNumber}`}
              </p>
              <p className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                "{item.verseText}"
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {item.translation.toUpperCase()}
              </p>
            </div>
            {item.note && (
              <p className="text-sm text-foreground/80 italic">
                {item.note}
              </p>
            )}
          </>
        ) : (
          <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border-l-4 border-l-accent">
            <div className="flex items-start gap-3">
              <Trophy size={28} weight="fill" className="text-accent flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {item.planName && (
                  <div className="flex items-center gap-2 mt-2">
                    <CalendarCheck size={16} weight="duotone" className="text-primary" />
                    <p className="text-sm font-medium text-primary">
                      {item.planName}
                    </p>
                  </div>
                )}
                {item.daysCompleted !== undefined && item.totalDays !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.daysCompleted} of {item.totalDays} days completed
                  </p>
                )}
                {item.streakDays !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.streakDays} day streak! 🔥
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <Separator />

        <div className="flex items-center gap-2">
          <Button
            variant={isLiked ? "default" : "ghost"}
            size="sm"
            onClick={onLike}
            className="gap-1"
          >
            <Heart size={16} weight={isLiked ? "fill" : "regular"} />
            <span className="text-xs">
              {item.likes.length > 0 && item.likes.length}
            </span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <ChatCircle size={16} weight="regular" />
            <span className="text-xs">
              {item.comments.length > 0 && item.comments.length}
            </span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 ml-auto">
            <ShareNetwork size={16} weight="regular" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
