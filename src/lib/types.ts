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
