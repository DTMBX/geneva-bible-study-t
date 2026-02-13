import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { X, PaperPlaneTilt, Users, MagnifyingGlass, Check } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import type { UserConnection, Message, Conversation } from '@/lib/types'
import { toast } from 'sonner'

interface ShareVerseWithFriendsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookName: string
  chapterNumber: number
  verseNumber: number
  verseEndNumber?: number
  verseText: string
  translation: string
}

export default function ShareVerseWithFriendsDialog({
  open,
  onOpenChange,
  bookName,
  chapterNumber,
  verseNumber,
  verseEndNumber,
  verseText,
  translation
}: ShareVerseWithFriendsDialogProps) {
  const [friends = []] = useKV<UserConnection[]>('user-friends', [])
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [])
  const [messages, setMessages] = useKV<Message[]>('messages', [])
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(new Set())
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [currentUserName, setCurrentUserName] = useState<string>('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await window.spark.user()
      setCurrentUserId(user?.id?.toString() || 'anonymous')
      setCurrentUserName(user?.login || 'Anonymous')
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!open) {
      setSelectedFriends(new Set())
      setMessageText('')
      setSearchQuery('')
    }
  }, [open])

  const filteredFriends = friends.filter(friend =>
    friend.userName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => {
      const newSet = new Set(prev)
      if (newSet.has(friendId)) {
        newSet.delete(friendId)
      } else {
        newSet.add(friendId)
      }
      return newSet
    })
  }

  const handleSendToFriends = async () => {
    if (selectedFriends.size === 0 || !currentUserId) return

    setSending(true)

    const verseReference = {
      bookName,
      chapterNumber,
      verseNumber,
      verseEndNumber,
      verseText: verseText.length > 200 ? verseText.substring(0, 200) + '...' : verseText,
      translation
    }

    const selectedFriendsList = Array.from(selectedFriends)
    const newMessages: Message[] = []
    const newConversations: Conversation[] = []
    const updatedConversations: Conversation[] = []

    for (const friendId of selectedFriendsList) {
      const friend = friends.find(f => f.userId === friendId)
      if (!friend) continue

      let conversation = (conversations || []).find(conv =>
        conv.participantIds.includes(currentUserId) && conv.participantIds.includes(friendId)
      )

      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        conversationId: conversation?.id || `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fromUserId: currentUserId,
        toUserId: friendId,
        content: messageText.trim() || 'Check out this verse!',
        verseReference,
        createdAt: Date.now()
      }

      if (!conversation) {
        const newConversation: Conversation = {
          id: newMessage.conversationId,
          participantIds: [currentUserId, friendId],
          participants: [
            {
              userId: currentUserId,
              userName: currentUserName,
            },
            {
              userId: friendId,
              userName: friend.userName,
              userAvatar: friend.userAvatar
            }
          ],
          lastMessage: newMessage,
          lastMessageAt: newMessage.createdAt,
          unreadCount: {
            [currentUserId]: 0,
            [friendId]: 1
          },
          createdAt: newMessage.createdAt
        }
        newConversations.push(newConversation)
      } else {
        updatedConversations.push({
          ...conversation,
          lastMessage: newMessage,
          lastMessageAt: newMessage.createdAt,
          unreadCount: {
            ...conversation.unreadCount,
            [friendId]: (conversation.unreadCount[friendId] || 0) + 1
          }
        })
      }

      newMessages.push(newMessage)
    }

    if (newConversations.length > 0) {
      setConversations((current = []) => [...current, ...newConversations])
    }

    if (updatedConversations.length > 0) {
      setConversations((current = []) => {
        return current.map(conv => {
          const updated = updatedConversations.find(u => u.id === conv.id)
          return updated || conv
        })
      })
    }

    setMessages((current = []) => [...current, ...newMessages])

    setSending(false)
    onOpenChange(false)

    const friendCount = selectedFriends.size
    toast.success(
      `Verse shared with ${friendCount} ${friendCount === 1 ? 'friend' : 'friends'}!`,
      {
        description: `${bookName} ${chapterNumber}:${verseNumber}${verseEndNumber && verseEndNumber !== verseNumber ? `-${verseEndNumber}` : ''}`
      }
    )
  }

  const verseRef = `${bookName} ${chapterNumber}:${verseNumber}${verseEndNumber && verseEndNumber !== verseNumber ? `-${verseEndNumber}` : ''}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Share Verse with Friends</DialogTitle>
          <DialogDescription>
            Send {verseRef} directly to your friends via message
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="bg-muted/50 rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {verseRef} - {translation.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm italic text-muted-foreground line-clamp-3">
              "{verseText}"
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Add a message (optional)</label>
            <Textarea
              placeholder="What do you want to say about this verse?"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">
                Select Friends ({selectedFriends.size} selected)
              </label>
              {selectedFriends.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFriends(new Set())}
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="relative mb-3">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {friends.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users size={48} weight="duotone" className="text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  You don't have any friends yet. Add friends to share verses with them!
                </p>
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No friends found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              <ScrollArea className="flex-1 -mx-2 px-2">
                <div className="space-y-1">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.userId}
                      onClick={() => toggleFriend(friend.userId)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                        ${selectedFriends.has(friend.userId) 
                          ? 'bg-accent/20 border border-accent' 
                          : 'hover:bg-muted/50'
                        }
                      `}
                    >
                      <Checkbox
                        checked={selectedFriends.has(friend.userId)}
                        onCheckedChange={() => toggleFriend(friend.userId)}
                      />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={friend.userAvatar} />
                        <AvatarFallback>{friend.userName[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{friend.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          Last active {new Date(friend.lastActivityAt).toLocaleDateString()}
                        </p>
                      </div>
                      {selectedFriends.has(friend.userId) && (
                        <Check size={20} weight="bold" className="text-accent" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendToFriends}
            disabled={selectedFriends.size === 0 || sending}
            className="flex-1"
          >
            {sending ? (
              <>Sending...</>
            ) : (
              <>
                <PaperPlaneTilt size={18} weight="fill" className="mr-2" />
                Send to {selectedFriends.size} {selectedFriends.size === 1 ? 'Friend' : 'Friends'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
