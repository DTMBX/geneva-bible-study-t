import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowLeft,
  PaperPlaneRight,
  DotsThreeVertical,
  UsersThree,
  Smiley,
  ThumbsUp,
  Heart,
  HandsPraying,
  Fire,
  Check,
  Info,
  SignOut,
  UserPlus,
  Bookmark,
  BookOpen,
  PushPin,
  X
} from '@phosphor-icons/react'
import type { GroupDiscussion, GroupMessage } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import GroupInfoDialog from './GroupInfoDialog'
import InviteMembersDialog from './InviteMembersDialog'

interface GroupDiscussionThreadProps {
  groupId: string
  groupName: string
  onBack?: () => void
}

const REACTION_EMOJIS = [
  { icon: ThumbsUp, key: 'thumbsup' },
  { icon: Heart, key: 'heart' },
  { icon: HandsPraying, key: 'pray' },
  { icon: Fire, key: 'fire' },
] as const

export default function GroupDiscussionThread({
  groupId,
  groupName,
  onBack,
}: GroupDiscussionThreadProps) {
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [currentUserName, setCurrentUserName] = useState<string>('')
  const [groups = [], setGroups] = useKV<GroupDiscussion[]>('group-discussions', [])
  const [messages = [], setMessages] = useKV<GroupMessage[]>(`group-messages-${groupId}`, [])
  const [newMessage, setNewMessage] = useState('')
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null)
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const group = groups.find(g => g.id === groupId)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await window.spark.user()
      setCurrentUserId(user?.id?.toString() || 'anonymous')
      setCurrentUserName(user?.login || 'Anonymous')
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (group && currentUserId) {
      setGroups((currentGroups) =>
        (currentGroups || []).map(g =>
          g.id === groupId
            ? {
                ...g,
                unreadCount: {
                  ...g.unreadCount,
                  [currentUserId]: 0
                }
              }
            : g
        )
      )
    }
  }, [groupId, currentUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !group) return

    const message: GroupMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      groupId,
      fromUserId: currentUserId,
      fromUserName: currentUserName,
      content: newMessage.trim(),
      createdAt: Date.now(),
      reactions: {}
    }

    setMessages((currentMessages) => [...(currentMessages || []), message])

    setGroups((currentGroups) =>
      (currentGroups || []).map(g =>
        g.id === groupId
          ? {
              ...g,
              lastMessageAt: Date.now(),
              unreadCount: Object.fromEntries(
                g.memberIds
                  .filter(id => id !== currentUserId)
                  .map(id => [id, (g.unreadCount[id] || 0) + 1])
              )
            }
          : g
      )
    )

    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleReaction = (messageId: string, reactionKey: string) => {
    setMessages((currentMessages) =>
      (currentMessages || []).map(msg => {
        if (msg.id !== messageId) return msg

        const reactions = { ...msg.reactions }
        const userList = reactions[reactionKey] || []

        if (userList.includes(currentUserId)) {
          reactions[reactionKey] = userList.filter(id => id !== currentUserId)
          if (reactions[reactionKey].length === 0) {
            delete reactions[reactionKey]
          }
        } else {
          reactions[reactionKey] = [...userList, currentUserId]
        }

        return { ...msg, reactions }
      })
    )
    setShowReactionPicker(null)
  }

  const handleLeaveGroup = () => {
    if (!group) return

    setGroups((currentGroups) =>
      (currentGroups || []).map(g => {
        if (g.id !== groupId) return g
        
        return {
          ...g,
          memberIds: g.memberIds.filter(id => id !== currentUserId),
          members: g.members.filter(m => m.userId !== currentUserId)
        }
      })
    )

    toast.success('Left the group')
    onBack?.()
  }

  const handlePinMessage = (messageId: string) => {
    if (!group) return

    const isPinned = group.pinnedMessageIds.includes(messageId)

    setGroups((currentGroups) =>
      (currentGroups || []).map(g => {
        if (g.id !== groupId) return g
        
        return {
          ...g,
          pinnedMessageIds: isPinned
            ? g.pinnedMessageIds.filter(id => id !== messageId)
            : [...g.pinnedMessageIds, messageId]
        }
      })
    )

    toast.success(isPinned ? 'Message unpinned' : 'Message pinned')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getReactionIcon = (key: string) => {
    const emoji = REACTION_EMOJIS.find(e => e.key === key)
    return emoji ? emoji.icon : ThumbsUp
  }

  if (!group) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Group not found</p>
      </div>
    )
  }

  const isAdmin = group.createdBy === currentUserId
  const isModerator = group.members.find(m => m.userId === currentUserId)?.role === 'moderator'
  const canPinMessages = isAdmin || isModerator

  const pinnedMessages = messages.filter(msg => group.pinnedMessageIds.includes(msg.id))
  const regularMessages = messages.filter(msg => !group.pinnedMessageIds.includes(msg.id))

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b bg-card p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft size={20} weight="bold" />
            </Button>
          )}
          
          <Avatar className="h-10 w-10 bg-primary/10">
            <AvatarFallback className="text-primary font-semibold">
              {getInitials(group.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{group.name}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <UsersThree size={14} weight="fill" />
              {group.memberIds.length} members
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <DotsThreeVertical size={20} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowInfoDialog(true)}>
                <Info size={18} weight="fill" className="mr-2" />
                Group Info
              </DropdownMenuItem>
              {group.settings.allowInvites && (
                <DropdownMenuItem onClick={() => setShowInviteDialog(true)}>
                  <UserPlus size={18} weight="fill" className="mr-2" />
                  Invite Members
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLeaveGroup}
                className="text-destructive focus:text-destructive"
              >
                <SignOut size={18} weight="fill" className="mr-2" />
                Leave Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {group.topic && (
          <Badge variant="outline" className="mt-3">
            {group.topic}
          </Badge>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {pinnedMessages.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
                <PushPin size={16} weight="fill" />
                <span>Pinned Messages</span>
              </div>
              <div className="space-y-3">
                {pinnedMessages.map((message) => {
                  const isOwnMessage = message.fromUserId === currentUserId

                  return (
                    <div
                      key={message.id}
                      className="relative bg-accent/30 border border-accent rounded-lg p-3"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="text-xs">
                            {getInitials(message.fromUserName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{message.fromUserName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                            </span>
                            <PushPin size={14} weight="fill" className="text-accent ml-auto" />
                          </div>

                          {message.verseReference && (
                            <div className="flex items-center gap-2 text-sm mb-2 pb-2 border-b border-border">
                              <BookOpen size={16} weight="fill" />
                              <span className="font-medium">
                                {message.verseReference.bookName} {message.verseReference.chapterNumber}:
                                {message.verseReference.verseNumber}
                                {message.verseReference.verseEndNumber &&
                                  `-${message.verseReference.verseEndNumber}`}
                              </span>
                            </div>
                          )}

                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                          {Object.keys(message.reactions).length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {Object.entries(message.reactions).map(([key, userIds]) => {
                                if (userIds.length === 0) return null
                                const ReactionIcon = getReactionIcon(key)
                                const hasReacted = userIds.includes(currentUserId)

                                return (
                                  <button
                                    key={key}
                                    onClick={() => toggleReaction(message.id, key)}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                                      hasReacted
                                        ? 'bg-primary/20 text-primary hover:bg-primary/30'
                                        : 'bg-muted hover:bg-muted/80'
                                    }`}
                                  >
                                    <ReactionIcon size={14} weight="fill" />
                                    <span>{userIds.length}</span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>

                        {canPinMessages && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 flex-shrink-0"
                            onClick={() => handlePinMessage(message.id)}
                          >
                            <X size={16} weight="bold" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {regularMessages.length === 0 && pinnedMessages.length === 0 ? (
            <div className="text-center py-12">
              <UsersThree size={64} weight="duotone" className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">No messages yet</p>
              <p className="text-sm text-muted-foreground">
                Start the conversation by sending the first message!
              </p>
            </div>
          ) : (
            regularMessages.map((message, index) => {
              const isOwnMessage = message.fromUserId === currentUserId
              const showAvatar = index === 0 || regularMessages[index - 1].fromUserId !== message.fromUserId
              const isPinned = group.pinnedMessageIds.includes(message.id)

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 ${showAvatar ? '' : 'opacity-0'}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(message.fromUserName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className={`flex-1 min-w-0 ${isOwnMessage ? 'flex flex-col items-end' : ''}`}>
                    {showAvatar && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{message.fromUserName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                    )}

                    <div className="group/message relative">
                      <div
                        className={`rounded-2xl px-4 py-2 inline-block max-w-[85%] ${
                          isOwnMessage
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.verseReference && (
                          <div className={`flex items-center gap-2 text-sm mb-2 pb-2 border-b ${
                            isOwnMessage ? 'border-primary-foreground/20' : 'border-border'
                          }`}>
                            <BookOpen size={16} weight="fill" />
                            <span className="font-medium">
                              {message.verseReference.bookName} {message.verseReference.chapterNumber}:
                              {message.verseReference.verseNumber}
                              {message.verseReference.verseEndNumber &&
                                `-${message.verseReference.verseEndNumber}`}
                            </span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      </div>

                      {Object.keys(message.reactions).length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {Object.entries(message.reactions).map(([key, userIds]) => {
                            if (userIds.length === 0) return null
                            const ReactionIcon = getReactionIcon(key)
                            const hasReacted = userIds.includes(currentUserId)

                            return (
                              <button
                                key={key}
                                onClick={() => toggleReaction(message.id, key)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                                  hasReacted
                                    ? 'bg-primary/20 text-primary hover:bg-primary/30'
                                    : 'bg-muted hover:bg-muted/80'
                                }`}
                              >
                                <ReactionIcon size={14} weight="fill" />
                                <span>{userIds.length}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}

                      <div className={`absolute top-0 opacity-0 group-hover/message:opacity-100 transition-opacity flex gap-1 ${isOwnMessage ? 'left-0 -translate-x-full -ml-2' : 'right-0 translate-x-full mr-2'}`}>
                        <DropdownMenu
                          open={showReactionPicker === message.id}
                          onOpenChange={(open) => setShowReactionPicker(open ? message.id : null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Smiley size={16} weight="fill" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {REACTION_EMOJIS.map(({ icon: Icon, key }) => (
                              <DropdownMenuItem
                                key={key}
                                onClick={() => toggleReaction(message.id, key)}
                              >
                                <Icon size={20} weight="fill" className="mr-2" />
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {canPinMessages && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handlePinMessage(message.id)}
                          >
                            <PushPin size={16} weight={isPinned ? 'fill' : 'regular'} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-card p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="gap-2"
          >
            <PaperPlaneRight size={18} weight="fill" />
            Send
          </Button>
        </div>
      </div>

      <GroupInfoDialog
        group={group}
        open={showInfoDialog}
        onOpenChange={setShowInfoDialog}
        isAdmin={isAdmin}
      />

      <InviteMembersDialog
        group={group}
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
    </div>
  )
}
