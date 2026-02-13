import { useState, useEffect, useRef, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import type { AudioNarrator, AudioPlaybackState, AudioPreferences, VerseUnit } from '@/lib/types'

export function useAvailableVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  return voices
}

export function useAudioNarrators(): AudioNarrator[] {
  const voices = useAvailableVoices()

  const narrators: AudioNarrator[] = [
    {
      id: 'david-american',
      name: 'David',
      description: 'Clear American male voice, excellent for study',
      gender: 'male',
      accent: 'american',
      voice: voices.find(v => v.lang.startsWith('en-US') && v.name.toLowerCase().includes('male')) || 
             voices.find(v => v.lang.startsWith('en-US')) || 
             voices[0] || null,
      previewText: 'In the beginning God created the heaven and the earth.',
      quality: 'standard'
    },
    {
      id: 'sarah-american',
      name: 'Sarah',
      description: 'Warm American female voice, comforting tone',
      gender: 'female',
      accent: 'american',
      voice: voices.find(v => v.lang.startsWith('en-US') && v.name.toLowerCase().includes('female')) || 
             voices.find(v => v.lang.startsWith('en-US') && !v.name.toLowerCase().includes('male')) ||
             voices.find(v => v.lang.startsWith('en-US')) || 
             voices[0] || null,
      previewText: 'The Lord is my shepherd; I shall not want.',
      quality: 'standard'
    },
    {
      id: 'james-british',
      name: 'James',
      description: 'Distinguished British male voice, traditional reading',
      gender: 'male',
      accent: 'british',
      voice: voices.find(v => v.lang.startsWith('en-GB') && v.name.toLowerCase().includes('male')) || 
             voices.find(v => v.lang.startsWith('en-GB')) ||
             voices.find(v => v.lang.startsWith('en-US')) || 
             voices[0] || null,
      previewText: 'For God so loved the world, that he gave his only begotten Son.',
      quality: 'premium'
    },
    {
      id: 'elizabeth-british',
      name: 'Elizabeth',
      description: 'Elegant British female voice, refined reading',
      gender: 'female',
      accent: 'british',
      voice: voices.find(v => v.lang.startsWith('en-GB') && v.name.toLowerCase().includes('female')) || 
             voices.find(v => v.lang.startsWith('en-GB') && !v.name.toLowerCase().includes('male')) ||
             voices.find(v => v.lang.startsWith('en-GB')) ||
             voices.find(v => v.lang.startsWith('en-US')) || 
             voices[0] || null,
      previewText: 'Blessed are the pure in heart: for they shall see God.',
      quality: 'premium'
    }
  ]

  return narrators.filter(n => n.voice !== null)
}

export function useAudioBible(verses: VerseUnit[]) {
  const narrators = useAudioNarrators()
  const [audioPreferences, setAudioPreferences] = useKV<AudioPreferences>('audio-preferences', {
    defaultNarratorId: 'david-american',
    playbackRate: 1.0,
    volume: 0.8,
    autoAdvanceChapter: false,
    highlightCurrentVerse: true
  })

  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>({
    isPlaying: false,
    isPaused: false,
    currentVerseNumber: 0,
    playbackRate: audioPreferences?.playbackRate || 1.0,
    volume: audioPreferences?.volume || 0.8,
    narratorId: audioPreferences?.defaultNarratorId || 'david-american',
    autoAdvanceChapter: audioPreferences?.autoAdvanceChapter || false
  })

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const currentVerseIndexRef = useRef<number>(0)

  const currentNarrator = narrators.find(n => n.id === playbackState.narratorId) || narrators[0]

  const speakVerse = useCallback((verseIndex: number) => {
    if (verseIndex >= verses.length) {
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentVerseNumber: 0
      }))
      return
    }

    const verse = verses[verseIndex]
    const utterance = new SpeechSynthesisUtterance(verse.text)
    
    if (currentNarrator?.voice) {
      utterance.voice = currentNarrator.voice
    }
    
    utterance.rate = playbackState.playbackRate
    utterance.volume = playbackState.volume
    utterance.lang = 'en-US'

    utterance.onstart = () => {
      setPlaybackState(prev => ({
        ...prev,
        currentVerseNumber: verse.verseNumber,
        isPlaying: true,
        isPaused: false
      }))
    }

    utterance.onend = () => {
      const nextIndex = verseIndex + 1
      if (nextIndex < verses.length && playbackState.isPlaying) {
        currentVerseIndexRef.current = nextIndex
        setTimeout(() => speakVerse(nextIndex), 500)
      } else {
        setPlaybackState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentVerseNumber: 0
        }))
      }
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false
      }))
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [verses, playbackState.playbackRate, playbackState.volume, playbackState.isPlaying, currentNarrator])

  const play = useCallback((startVerseNumber?: number) => {
    window.speechSynthesis.cancel()
    
    const startIndex = startVerseNumber 
      ? verses.findIndex(v => v.verseNumber === startVerseNumber)
      : currentVerseIndexRef.current

    currentVerseIndexRef.current = startIndex >= 0 ? startIndex : 0
    speakVerse(currentVerseIndexRef.current)
  }, [verses, speakVerse])

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    setPlaybackState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: true
    }))
  }, [])

  const resume = useCallback(() => {
    if (playbackState.isPaused) {
      window.speechSynthesis.resume()
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false
      }))
    } else {
      play()
    }
  }, [playbackState.isPaused, play])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    currentVerseIndexRef.current = 0
    setPlaybackState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentVerseNumber: 0
    }))
  }, [])

  const skipToVerse = useCallback((verseNumber: number) => {
    const wasPlaying = playbackState.isPlaying
    stop()
    if (wasPlaying) {
      setTimeout(() => play(verseNumber), 100)
    } else {
      const verseIndex = verses.findIndex(v => v.verseNumber === verseNumber)
      currentVerseIndexRef.current = verseIndex >= 0 ? verseIndex : 0
      setPlaybackState(prev => ({
        ...prev,
        currentVerseNumber: verseNumber
      }))
    }
  }, [playbackState.isPlaying, stop, play, verses])

  const setNarrator = useCallback((narratorId: string) => {
    const wasPlaying = playbackState.isPlaying
    const currentVerse = playbackState.currentVerseNumber
    
    stop()
    
    setPlaybackState(prev => ({
      ...prev,
      narratorId
    }))
    
    setAudioPreferences(current => ({
      defaultNarratorId: narratorId,
      playbackRate: current?.playbackRate || 1.0,
      volume: current?.volume || 0.8,
      autoAdvanceChapter: current?.autoAdvanceChapter || false,
      highlightCurrentVerse: current?.highlightCurrentVerse || true
    }))

    if (wasPlaying && currentVerse > 0) {
      setTimeout(() => play(currentVerse), 100)
    }
  }, [playbackState.isPlaying, playbackState.currentVerseNumber, stop, play, setAudioPreferences])

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackState(prev => ({
      ...prev,
      playbackRate: rate
    }))
    
    setAudioPreferences(current => ({
      defaultNarratorId: current?.defaultNarratorId || 'david-american',
      playbackRate: rate,
      volume: current?.volume || 0.8,
      autoAdvanceChapter: current?.autoAdvanceChapter || false,
      highlightCurrentVerse: current?.highlightCurrentVerse || true
    }))

    if (utteranceRef.current) {
      utteranceRef.current.rate = rate
    }
  }, [setAudioPreferences])

  const setVolume = useCallback((volume: number) => {
    setPlaybackState(prev => ({
      ...prev,
      volume
    }))
    
    setAudioPreferences(current => ({
      defaultNarratorId: current?.defaultNarratorId || 'david-american',
      playbackRate: current?.playbackRate || 1.0,
      volume: volume,
      autoAdvanceChapter: current?.autoAdvanceChapter || false,
      highlightCurrentVerse: current?.highlightCurrentVerse || true
    }))

    if (utteranceRef.current) {
      utteranceRef.current.volume = volume
    }
  }, [setAudioPreferences])

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  return {
    playbackState,
    currentNarrator,
    narrators,
    audioPreferences,
    play,
    pause,
    resume,
    stop,
    skipToVerse,
    setNarrator,
    setPlaybackRate,
    setVolume
  }
}
