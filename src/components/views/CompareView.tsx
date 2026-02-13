import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Columns, Info } from '@phosphor-icons/react'
import { translations, sampleVerses, bibleBooks } from '@/lib/data'
import type { UserProfile } from '@/lib/types'

interface CompareViewProps {
  userProfile: UserProfile
}

export default function CompareView({ userProfile }: CompareViewProps) {
  const [selectedTranslations, setSelectedTranslations] = useState(
    userProfile?.preferences?.comparisonSet || ['geneva', 'kjv', 'esv', 'niv']
  )
  const [currentPassage] = useState({ workId: 'gen', chapter: 1, verse: 1 })

  const toggleTranslation = (translationId: string) => {
    setSelectedTranslations(current => {
      if (current.includes(translationId)) {
        return current.filter(id => id !== translationId)
      } else {
        return [...current, translationId]
      }
    })
  }

  const activeTranslations = translations.filter(t => selectedTranslations.includes(t.id))
  const book = bibleBooks.find(b => b.id === currentPassage.workId)

  const getVersesForPassage = () => {
    return selectedTranslations.map(transId => {
      const verse = sampleVerses.find(
        v => v.workId === currentPassage.workId &&
             v.chapterNumber === currentPassage.chapter &&
             v.verseNumber === currentPassage.verse &&
             v.translationId === transId
      )
      return { translationId: transId, verse }
    })
  }

  const verses = getVersesForPassage()

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-foreground flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)' }}>
            <Columns size={32} weight="duotone" className="text-primary" />
            Compare Translations
          </h2>
          <p className="text-muted-foreground mb-4">
            See how different English Bibles translate the same passage
          </p>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Active translations:</span>
            {translations.map(trans => (
              <Badge
                key={trans.id}
                variant={selectedTranslations.includes(trans.id) ? 'default' : 'outline'}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleTranslation(trans.id)}
              >
                {trans.shortCode}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-between">
                <span>
                  {book?.title} {currentPassage.chapter}:{currentPassage.verse}
                </span>
                <Select defaultValue={currentPassage.workId}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bibleBooks.map(b => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
          </Card>

          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-6">
              {verses.map(({ translationId, verse }) => {
                const translation = translations.find(t => t.id === translationId)
                if (!translation) return null

                return (
                  <Card key={translationId} className="border-l-4" style={{ borderLeftColor: translationId === 'geneva' ? 'var(--primary)' : 'var(--accent)' }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{translation.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {translation.year} • {translation.philosophy.replace(/-/g, ' ')}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Info size={20} weight="duotone" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {verse ? (
                        <div>
                          <p 
                            className="text-lg leading-relaxed"
                            style={{ 
                              fontFamily: 'var(--font-body)',
                              lineHeight: '1.75'
                            }}
                          >
                            <span className="font-mono text-xs text-muted-foreground mr-2" style={{ fontFamily: 'var(--font-mono)' }}>
                              {verse.verseNumber}
                            </span>
                            {verse.text}
                          </p>
                          {translationId === 'geneva' && (
                            <div className="mt-4 p-3 bg-secondary/50 rounded-md border-l-2 border-accent">
                              <p className="text-xs font-semibold mb-1 text-accent-foreground">Geneva Note:</p>
                              <p className="text-sm text-muted-foreground italic">
                                This verse establishes God as the sovereign creator, a foundational Reformed doctrine emphasizing divine sovereignty and purpose in creation.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Verse not available in this translation
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>

          {activeTranslations.length < 2 && (
            <Card className="mt-6 border-accent">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Select at least two translations to compare passages side by side
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
