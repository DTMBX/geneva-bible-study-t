import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Users, MagnifyingGlass, UserPlus, Check, X, DotsThree } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { UserConnection, FriendRequest } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface FriendsListProps {
  onViewJourney: (userId: string) => void
}

export default function FriendsList({ onViewJourney }: FriendsListProps) {
  const [friends = []] = useKV<UserConnection[]>('user-friends', [])
  const [friendRequests = [], setFriendRequests] = useKV<FriendRequest[]>('friend-requests', [])
  const [searchQuery, setSearchQuery] = useState('')

  const pendingRequests = friendRequests.filter(req => req.status === 'pending')
  const filteredFriends = friends.filter(friend =>
    friend.userName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAcceptRequest = async (requestId: string) => {
    const user = await window.spark.user()
    const request = friendRequests.find(r => r.id === requestId)
    if (!request) return

    setFriendRequests((current = []) =>
      current.map(r =>
        r.id === requestId
          ? { ...r, status: 'accepted' as const, respondedAt: Date.now() }
          : r
      )
    )

    toast.success(`You are now friends with ${request.fromUserName}!`)
  }

  const handleRejectRequest = async (requestId: string) => {
    setFriendRequests((current = []) =>
      current.map(r =>
        r.id === requestId
          ? { ...r, status: 'rejected' as const, respondedAt: Date.now() }
          : r
      )
    )
    toast('Friend request declined')
  }

  const handleRemoveFriend = async (userId: string) => {
    const friendsData = await window.spark.kv.get<UserConnection[]>('user-friends')
    const updatedFriends = (friendsData || []).filter(f => f.userId !== userId)
    await window.spark.kv.set('user-friends', updatedFriends)
    toast('Friend removed')
  }

  return (
    <div className="space-y-6">
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus size={20} weight="duotone" className="text-primary" />
              Friend Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={request.fromUserAvatar} />
                  <AvatarFallback>{request.fromUserName[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{request.fromUserName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(request.createdAt, { addSuffix: true })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptRequest(request.id)}
                    className="gap-1"
                  >
                    <Check size={16} weight="bold" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    <X size={16} weight="bold" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users size={20} weight="duotone" className="text-primary" />
            My Friends ({friends.length})
          </CardTitle>
          <div className="relative mt-3">
            <MagnifyingGlass
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              weight="bold"
            />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredFriends.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} weight="duotone" className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No friends found' : 'No friends yet'}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredFriends.map((friend, index) => (
                  <div key={friend.userId}>
                    {index > 0 && <Separator className="my-2" />}
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={friend.userAvatar} />
                        <AvatarFallback>{friend.userName[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{friend.userName}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs text-muted-foreground">
                            Active {formatDistanceToNow(friend.lastActivityAt, { addSuffix: true })}
                          </p>
                          {friend.mutualFriends > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {friend.mutualFriends} mutual
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewJourney(friend.userId)}
                        >
                          View Journey
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <DotsThree size={20} weight="bold" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewJourney(friend.userId)}>
                              View Journey
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleRemoveFriend(friend.userId)}
                            >
                              Remove Friend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
