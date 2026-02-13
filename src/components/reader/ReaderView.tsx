import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { CaretLeft, CaretRight, BookOpen, BookmarkSimple, NotePencil, Gear, ListNumbers } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { bibleBooks } from '@/lib/data'
import type { UserProfile, VerseUnit, PassageReference } from '@/lib/types'
import { generateChapterVerses } from '@/lib/verse-generator'

interface ReaderViewProps {
  userProfile: UserProfile
}

export default function ReaderView({ userProfile }: ReaderViewProps) {
  const [currentBookId, setCurrentBookId] = useState('gen')
  const [currentChapter, setCurrentChapter] = useState(1)
  const [selectedVerses, setSelectedVerses] = useState<number[]>([])
  
  const [lastReadPosition, setLastReadPosition] = useKV<PassageReference>('last-read-position', {
    workId: 'gen',
    chapterNumber: 1,
    verseNumber: 1
  })

  const currentBook = bibleBooks.find(b => b.id === currentBookId)
  const translationId = userProfile.preferences.defaultTranslation

  useEffect(() => {
    if (lastReadPosition) {
      setCurrentBookId(lastReadPosition.workId)
      setCurrentChapter(lastReadPosition.chapterNumber)
    }
  }, [])

  useEffect(() => {
    setLastReadPosition((current) => ({
      workId: currentBookId,
      chapterNumber: currentChapter,
      verseNumber: 1
    }))
  }, [currentBookId, currentChapter, setLastReadPosition])

  const verses = generateChapterVerses(currentBookId, currentChapter, translationId)

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1)
      setSelectedVerses([])
    } else {
      const currentBookIndex = bibleBooks.findIndex(b => b.id === currentBookId)
      if (currentBookIndex > 0) {
        const prevBook = bibleBooks[currentBookIndex - 1]
        setCurrentBookId(prevBook.id)
        setCurrentChapter(prevBook.chaptersCount)
        setSelectedVerses([])
      }
    }
  }

  const handleNextChapter = () => {
    if (currentBook && currentChapter < currentBook.chaptersCount) {
      setCurrentChapter(currentChapter + 1)
      setSelectedVerses([])
    } else {
      const currentBookIndex = bibleBooks.findIndex(b => b.id === currentBookId)
      if (currentBookIndex < bibleBooks.length - 1) {
        const nextBook = bibleBooks[currentBookIndex + 1]
        setCurrentBookId(nextBook.id)
        setCurrentChapter(1)
        setSelectedVerses([])
      }
    }
  }

  const handleVerseClick = (verseNumber: number) => {
    setSelectedVerses(prev => {
      if (prev.includes(verseNumber)) {
        return prev.filter(v => v !== verseNumber)
      }
      return [...prev, verseNumber]
    })
  }

  const handleBookChange = (bookId: string) => {
    setCurrentBookId(bookId)
    setCurrentChapter(1)
    setSelectedVerses([])
  }

  const handleChapterChange = (chapter: string) => {
    setCurrentChapter(parseInt(chapter))
    setSelectedVerses([])
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Select value={currentBookId} onValueChange={handleBookChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bibleBooks.map(book => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentChapter.toString()} onValueChange={handleChapterChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: currentBook?.chaptersCount || 1 }, (_, i) => i + 1).map(ch => (
                <SelectItem key={ch} value={ch.toString()}>
                  Chapter {ch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="secondary" className="hidden sm:flex">
            {translationId.toUpperCase()}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {selectedVerses.length > 0 && (
            <>
              <Button variant="ghost" size="sm">
                <NotePencil size={18} weight="duotone" />
              </Button>
              <Button variant="ghost" size="sm">
                <BookmarkSimple size={18} weight="duotone" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                {currentBook?.title}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Chapter {currentChapter}</Badge>
                <Badge variant="secondary">{currentBook?.category}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              {verses.map((verse) => (
                <div
                  key={verse.id}
                  onClick={() => handleVerseClick(verse.verseNumber)}
                  className={`
                    group cursor-pointer rounded-md px-3 py-2 transition-colors
                    ${selectedVerses.includes(verse.verseNumber) 
                      ? 'bg-accent/20 border-l-4 border-l-accent' 
                      : 'hover:bg-muted/50'
                    }
                  `}
                >
                  <div className="flex gap-3">
                    <span 
                      className="text-xs text-muted-foreground font-mono mt-1 select-none opacity-50 group-hover:opacity-100 transition-opacity"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {verse.verseNumber}
                    </span>
                    <p 
                      className="flex-1 leading-relaxed text-foreground"
                      style={{ 
                        fontFamily: 'var(--font-body)',
                        fontSize: `${userProfile.preferences.fontSize}px`,
                        lineHeight: userProfile.preferences.lineSpacing
                      }}
                    >
                      {verse.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevChapter}
                disabled={currentBookId === bibleBooks[0]?.id && currentChapter === 1}
              >
                <CaretLeft size={20} weight="bold" className="mr-2" />
                Previous Chapter
              </Button>

              <Button
                variant="outline"
                onClick={handleNextChapter}
                disabled={
                  currentBookId === bibleBooks[bibleBooks.length - 1]?.id &&
                  currentChapter === currentBook?.chaptersCount
                }
              >
                Next Chapter
                <CaretRight size={20} weight="bold" className="ml-2" />
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
