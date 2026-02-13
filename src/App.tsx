import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { BookOpen, Books, Columns, MagnifyingGlass, Clock, Gear, Code, CalendarCheck, Users } from '@phosphor-icons/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useIsMobile } from '@/hooks/use-mobile'
import HomeView from '@/components/views/HomeView'
import LibraryView from '@/components/views/LibraryView'
import CompareView from '@/components/views/CompareView'
import SearchView from '@/components/views/SearchView'
import TimelineView from '@/components/views/TimelineView'
import SettingsView from '@/components/views/SettingsView'
import ReadingPlanView from '@/components/views/ReadingPlanView'
import SocialView from '@/components/views/SocialView'
import ReaderView from '@/components/reader/ReaderView'
import BibleApiDemo from '@/components/BibleApiDemo'
import type { UserProfile, FriendRequest } from '@/lib/types'

function App() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState('api-demo')
  
  const [userProfile] = useKV<UserProfile>('user-profile', {
    id: 'default-user',
    displayName: 'Reader',
    role: 'reader',
    preferences: {
      defaultTranslation: 'geneva',
      comparisonSet: ['geneva', 'kjv', 'esv', 'niv'],
      fontSize: 18,
      lineSpacing: 1.75,
      fontFamily: 'Literata',
      nightMode: false,
      redLetterText: false,
      verseNumbersVisible: true
    }
  })

  const [friendRequests = []] = useKV<FriendRequest[]>('friend-requests', [])
  const pendingRequestCount = friendRequests.filter(req => req.status === 'pending').length

  const handleNavigateToReader = (bookId: string, chapter: number) => {
    setActiveTab('reader')
    setTimeout(() => {
      const event = new CustomEvent('navigate-to-passage', {
        detail: { bookId, chapter }
      })
      window.dispatchEvent(event)
    }, 100)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Books size={28} weight="duotone" className="text-primary" />
          <h1 className="text-2xl font-bold text-primary tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Geneva Bible Study
          </h1>
        </div>
        {!isMobile && (
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <Gear size={24} weight="duotone" className="text-muted-foreground" />
          </button>
        )}
      </header>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {isMobile ? (
            <>
              <div className="flex-1 overflow-auto">
                <TabsContent value="api-demo" className="mt-0 h-full">
                  <BibleApiDemo />
                </TabsContent>
                <TabsContent value="home" className="mt-0 h-full">
                  <HomeView userProfile={userProfile!} />
                </TabsContent>
                <TabsContent value="reader" className="mt-0 h-full">
                  <ReaderView userProfile={userProfile!} />
                </TabsContent>
                <TabsContent value="library" className="mt-0 h-full">
                  <LibraryView />
                </TabsContent>
                <TabsContent value="compare" className="mt-0 h-full">
                  <CompareView userProfile={userProfile!} />
                </TabsContent>
                <TabsContent value="search" className="mt-0 h-full">
                  <SearchView />
                </TabsContent>
                <TabsContent value="timeline" className="mt-0 h-full">
                  <TimelineView />
                </TabsContent>
                <TabsContent value="reading-plan" className="mt-0 h-full">
                  <ReadingPlanView onNavigateToReader={handleNavigateToReader} />
                </TabsContent>
                <TabsContent value="social" className="mt-0 h-full">
                  <SocialView />
                </TabsContent>
                <TabsContent value="settings" className="mt-0 h-full">
                  <SettingsView userProfile={userProfile!} />
                </TabsContent>
              </div>

              <TabsList className="w-full h-16 rounded-none border-t grid grid-cols-8 bg-card">.
                <TabsTrigger value="api-demo" className="flex-col gap-1 data-[state=active]:text-primary">
                  <Code size={24} weight="duotone" />
                  <span className="text-xs">API</span>
                </TabsTrigger>
                <TabsTrigger value="home" className="flex-col gap-1 data-[state=active]:text-primary">
                  <BookOpen size={24} weight="duotone" />
                  <span className="text-xs">Home</span>
                </TabsTrigger>
                <TabsTrigger value="library" className="flex-col gap-1 data-[state=active]:text-primary">
                  <Books size={24} weight="duotone" />
                  <span className="text-xs">Library</span>
                </TabsTrigger>
                <TabsTrigger value="reading-plan" className="flex-col gap-1 data-[state=active]:text-primary">
                  <CalendarCheck size={24} weight="duotone" />
                  <span className="text-xs">Plans</span>
                </TabsTrigger>
                <TabsTrigger value="compare" className="flex-col gap-1 data-[state=active]:text-primary">
                  <Columns size={24} weight="duotone" />
                  <span className="text-xs">Compare</span>
                </TabsTrigger>
                <TabsTrigger value="search" className="flex-col gap-1 data-[state=active]:text-primary">
                  <MagnifyingGlass size={24} weight="duotone" />
                  <span className="text-xs">Search</span>
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex-col gap-1 data-[state=active]:text-primary">
                  <Clock size={24} weight="duotone" />
                  <span className="text-xs">Timeline</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex-col gap-1 data-[state=active]:text-primary relative">
                  <Users size={24} weight="duotone" />
                  <span className="text-xs">Social</span>
                  {pendingRequestCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-destructive">
                      {pendingRequestCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </>
          ) : (
            <div className="flex h-full">
              <TabsList className="w-60 flex-col gap-2 p-4 rounded-none border-r bg-card items-stretch justify-start h-full">
                <TabsTrigger value="api-demo" className="justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Code size={24} weight="duotone" />
                  <span>API Demo</span>
                </TabsTrigger>
                <TabsTrigger value="home" className="justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <BookOpen size={24} weight="duotone" />
                  <span>Home</span>
                </TabsTrigger>
                <TabsTrigger value="reader" className="justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <BookOpen size={24} weight="duotone" />
                  <span>Reader</span>
                </TabsTrigger>
                <TabsTrigger value="library" className="justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Books size={24} weight="duotone" />
                  <span>Library</span>
                </TabsTrigger>
                <TabsTrigger value="compare" className="justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Columns size={24} weight="duotone" />
                  <span>Compare</span>
                </TabsTrigger>
                <TabsTrigger value="search" className="justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <MagnifyingGlass size={24} weight="duotone" />
                  <span>Search</span>
                </TabsTrigger>
                <TabsTrigger value="timeline" className="justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Clock size={24} weight="duotone" />
                  <span>Timeline</span>
                </TabsTrigger>
                <TabsTrigger value="reading-plan" className="justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <CalendarCheck size={24} weight="duotone" />
                  <span>Reading Plans</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative">
                  <Users size={24} weight="duotone" />
                  <span>Social</span>
                  {pendingRequestCount > 0 && (
                    <Badge className="ml-auto h-6 w-6 flex items-center justify-center p-0 text-xs bg-destructive">
                      {pendingRequestCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <div className="flex-1" />
                <TabsTrigger value="settings" className="justify-start gap-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Gear size={24} weight="duotone" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto">
                <TabsContent value="api-demo" className="mt-0 h-full">
                  <BibleApiDemo />
                </TabsContent>
                <TabsContent value="home" className="mt-0 h-full">
                  <HomeView userProfile={userProfile!} />
                </TabsContent>
                <TabsContent value="reader" className="mt-0 h-full">
                  <ReaderView userProfile={userProfile!} />
                </TabsContent>
                <TabsContent value="library" className="mt-0 h-full">
                  <LibraryView />
                </TabsContent>
                <TabsContent value="compare" className="mt-0 h-full">
                  <CompareView userProfile={userProfile!} />
                </TabsContent>
                <TabsContent value="search" className="mt-0 h-full">
                  <SearchView />
                </TabsContent>
                <TabsContent value="timeline" className="mt-0 h-full">
                  <TimelineView />
                </TabsContent>
                <TabsContent value="reading-plan" className="mt-0 h-full">
                  <ReadingPlanView onNavigateToReader={handleNavigateToReader} />
                </TabsContent>
                <TabsContent value="social" className="mt-0 h-full">
                  <SocialView />
                </TabsContent>
                <TabsContent value="settings" className="mt-0 h-full">
                  <SettingsView userProfile={userProfile!} />
                </TabsContent>
              </div>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  )
}

export default App
