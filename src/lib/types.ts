export type CanonTradition = 'protestant' | 'catholic' | 'orthodox' | 'jewish' | 'ethiopian'

export type BookCategory = 'law' | 'history' | 'wisdom' | 'prophets' | 'gospels' | 'epistles' | 'apocalypse' | 'deuterocanon' | 'other'

export type ConfidenceLevel = 'traditional' | 'scholarly-consensus' | 'debated' | 'speculative'

export type TranslationPhilosophy = 'formal-equivalence' | 'optimal-equivalence' | 'dynamic-equivalence' | 'paraphrase'

export interface TextWork {
  id: string
  title: string
  shortName: string
  category: BookCategory
  canonStatus: Record<CanonTradition, 'canonical' | 'deuterocanonical' | 'apocryphal' | 'non-canonical'>
  chaptersCount: number
  compositionDate: string
  compositionConfidence: ConfidenceLevel
  traditionalAuthor?: string
  introduction: string
  metadata: {
    testament: 'old' | 'new' | 'other'
    order: number
  }
}

export interface WorkSection {
  id: string
  workId: string
  chapterNumber: number
  verseCount: number
}

export interface VerseUnit {
  id: string
  workId: string
  chapterNumber: number
  verseNumber: number
  translationId: string
  text: string
  footnotes?: string[]
  crossReferences?: string[]
}

export interface TranslationEdition {
  id: string
  name: string
  shortCode: string
  year: number
  philosophy: TranslationPhilosophy
  philosophyScore: number
  editors: string[]
  sourceTexts: string[]
  revisionLineage: string[]
  license: string
  licenseRestrictions: {
    offlineAllowed: boolean
    fullTextAllowed: boolean
    excerptLimit?: number
  }
  description: string
  languageCode: string
}

export interface AlignmentMap {
  id: string
  sourceVerseId: string
  targetVerseId: string
  alignmentType: 'exact' | 'split' | 'merged' | 'reordered' | 'omitted'
  notes?: string
}

export interface HistoricalEvent {
  id: string
  title: string
  date: string
  dateConfidence: ConfidenceLevel
  era: string
  category: 'narrative' | 'composition' | 'canon-formation' | 'community-history'
  description: string
  sources: SourceCitation[]
  relatedWorks: string[]
  tradition?: CanonTradition
}

export interface SourceCitation {
  id: string
  title: string
  author?: string
  year?: number
  url?: string
  notes?: string
}

export interface UserNote {
  id: string
  userId: string
  verseId: string
  workId: string
  chapterNumber: number
  verseNumber: number
  content: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export interface Highlight {
  id: string
  userId: string
  verseId: string
  workId: string
  chapterNumber: number
  verseNumber: number
  color: string
  createdAt: number
}

export interface Bookmark {
  id: string
  userId: string
  verseId: string
  workId: string
  chapterNumber: number
  verseNumber: number
  label: string
  createdAt: number
}

export interface DownloadPack {
  id: string
  name: string
  description: string
  translationIds: string[]
  workIds: string[]
  sizeBytes: number
  version: string
  downloadedAt?: number
}

export interface UserProfile {
  id: string
  displayName: string
  email?: string
  role: 'reader' | 'curator' | 'admin'
  preferences: {
    defaultTranslation: string
    comparisonSet: string[]
    fontSize: number
    lineSpacing: number
    fontFamily: string
    nightMode: boolean
    redLetterText: boolean
    verseNumbersVisible: boolean
  }
  lastReadPosition?: {
    workId: string
    chapterNumber: number
    verseNumber: number
  }
}

export interface AuditLog {
  id: string
  userId: string
  entityType: string
  entityId: string
  action: 'create' | 'update' | 'delete'
  changes: Record<string, unknown>
  timestamp: number
  reversible: boolean
}

export interface PassageReference {
  workId: string
  chapterNumber: number
  verseNumber: number
  verseEndNumber?: number
}

export interface ComparisonSet {
  id: string
  name: string
  translationIds: string[]
  createdAt: number
}

export interface ReadingPlanDay {
  day: number
  readings: PassageReference[]
  completed?: boolean
  completedAt?: number
}

export interface ReadingPlan {
  id: string
  name: string
  description: string
  duration: number
  category: 'chronological' | 'canonical' | 'thematic' | 'devotional' | 'custom'
  days: ReadingPlanDay[]
  isCustom?: boolean
  createdBy?: string
  createdAt?: number
}

export interface UserReadingPlan {
  id: string
  userId: string
  planId: string
  startDate: number
  currentDay: number
  completedDays: number[]
  paused: boolean
  notes: Record<number, string>
  reminderEnabled?: boolean
  reminderTime?: string
  lastReminderSent?: number
}

export interface NotificationSettings {
  enabled: boolean
  dailyReminderTime: string
  soundEnabled: boolean
  desktopNotifications: boolean
  missedDayReminders: boolean
}

export type ShareType = 'verse' | 'progress' | 'milestone' | 'plan'

export type ImageCardTemplate = 'classic' | 'modern' | 'minimalist' | 'illuminated'

export interface SharedVerse {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  verseId: string
  workId: string
  bookName: string
  chapterNumber: number
  verseNumber: number
  verseEndNumber?: number
  verseText: string
  translation: string
  note?: string
  imageTemplate?: ImageCardTemplate
  imageDataUrl?: string
  createdAt: number
  likes: string[]
  comments: SharedComment[]
}

export interface SharedProgress {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  type: 'milestone' | 'plan-complete' | 'streak'
  title: string
  description: string
  planName?: string
  planId?: string
  daysCompleted?: number
  totalDays?: number
  streakDays?: number
  createdAt: number
  likes: string[]
  comments: SharedComment[]
}

export interface SharedComment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: number
}

export interface ShareSettings {
  autoShareMilestones: boolean
  autoShareStreaks: boolean
  shareToPublicFeed: boolean
  allowComments: boolean
}

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected'

export interface FriendRequest {
  id: string
  fromUserId: string
  fromUserName: string
  fromUserAvatar?: string
  toUserId: string
  status: FriendRequestStatus
  createdAt: number
  respondedAt?: number
}

export interface UserConnection {
  userId: string
  userName: string
  userAvatar?: string
  connectedAt: number
  lastActivityAt: number
  mutualFriends: number
}

export interface UserActivity {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  type: 'verse-shared' | 'milestone-achieved' | 'plan-completed' | 'streak-milestone' | 'chapter-read' | 'note-created'
  timestamp: number
  data: {
    verseId?: string
    bookName?: string
    chapterNumber?: number
    verseNumber?: number
    planName?: string
    streakDays?: number
    notePreview?: string
    [key: string]: any
  }
  visibility: 'public' | 'friends' | 'private'
}

export interface CommunityProfile {
  userId: string
  userName: string
  userAvatar?: string
  bio?: string
  location?: string
  denomination?: string
  favoriteBooks: string[]
  readingGoals: {
    chaptersPerWeek?: number
    currentStreak: number
    longestStreak: number
    totalChaptersRead: number
    plansCompleted: number
  }
  privacy: {
    profileVisible: boolean
    showReadingProgress: boolean
    showFriendsList: boolean
    allowFriendRequests: boolean
  }
  createdAt: number
  updatedAt: number
}

export interface ReadingJourney {
  userId: string
  currentBook?: string
  currentChapter?: number
  recentActivity: UserActivity[]
  activeReadingPlans: {
    planId: string
    planName: string
    progress: number
    currentDay: number
    totalDays: number
  }[]
  recentVerses: {
    verseId: string
    bookName: string
    reference: string
    timestamp: number
  }[]
  milestones: {
    id: string
    type: 'streak' | 'chapters' | 'plan-complete' | 'year-complete'
    title: string
    achievedAt: number
    value: number
  }[]
}
