import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Calendar, CheckCircle, Circle, BookOpen, Play, Pause, ArrowCounterClockwise, CalendarBlank, ListChecks } from '@phosphor-icons/react'
import { readingPlans, getBookDisplayName } from '@/lib/reading-plans'
import type { UserReadingPlan, ReadingPlan } from '@/lib/types'
import { toast } from 'sonner'

export default function ReadingPlanView() {
  const [activeUserPlans = [], setActiveUserPlans] = useKV<UserReadingPlan[]>('user-reading-plans', [])
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [showPlanSelector, setShowPlanSelector] = useState(false)

  const selectedUserPlan = activeUserPlans?.find(p => p.planId === selectedPlanId)
  const selectedPlan = readingPlans.find(p => p.id === selectedPlanId)

  const startPlan = (planId: string) => {
    const existingPlan = activeUserPlans?.find(p => p.planId === planId)
    
    if (existingPlan) {
      setSelectedPlanId(planId)
      setShowPlanSelector(false)
      toast.success('Resumed reading plan')
      return
    }

    const newUserPlan: UserReadingPlan = {
      id: `plan-${Date.now()}`,
      userId: 'default-user',
      planId,
      startDate: Date.now(),
      currentDay: 1,
      completedDays: [],
      paused: false,
      notes: {}
    }

    setActiveUserPlans(current => [...(current || []), newUserPlan])
    setSelectedPlanId(planId)
    setShowPlanSelector(false)
    toast.success('Reading plan started!')
  }

  const markDayComplete = (day: number) => {
    setActiveUserPlans(current => 
      (current || []).map(plan => {
        if (plan.planId === selectedPlanId) {
          const isCompleted = plan.completedDays.includes(day)
          const newCompletedDays = isCompleted
            ? plan.completedDays.filter(d => d !== day)
            : [...plan.completedDays, day].sort((a, b) => a - b)
          
          return {
            ...plan,
            completedDays: newCompletedDays,
            currentDay: Math.max(...newCompletedDays, plan.currentDay)
          }
        }
        return plan
      })
    )
    
    toast.success(activeUserPlans.find(p => p.planId === selectedPlanId)?.completedDays.includes(day) 
      ? 'Day marked incomplete' 
      : 'Day completed! 🎉'
    )
  }

  const togglePause = () => {
    setActiveUserPlans(current =>
      (current || []).map(plan => 
        plan.planId === selectedPlanId 
          ? { ...plan, paused: !plan.paused }
          : plan
      )
    )
    toast.success(selectedUserPlan?.paused ? 'Plan resumed' : 'Plan paused')
  }

  const resetPlan = () => {
    if (!confirm('Are you sure you want to reset this plan? All progress will be lost.')) return
    
    setActiveUserPlans(current =>
      (current || []).map(plan =>
        plan.planId === selectedPlanId
          ? {
              ...plan,
              currentDay: 1,
              completedDays: [],
              startDate: Date.now(),
              paused: false,
              notes: {}
            }
          : plan
      )
    )
    toast.success('Plan reset')
  }

  const getCurrentDayReading = () => {
    if (!selectedPlan || !selectedUserPlan) return null
    
    const nextIncompleteDay = selectedPlan.days.find(
      day => !selectedUserPlan.completedDays.includes(day.day)
    )
    
    return nextIncompleteDay || selectedPlan.days[selectedPlan.days.length - 1]
  }

  const getProgressPercentage = () => {
    if (!selectedUserPlan || !selectedPlan) return 0
    return (selectedUserPlan.completedDays.length / selectedPlan.duration) * 100
  }

  const getDaysElapsed = () => {
    if (!selectedUserPlan) return 0
    return Math.floor((Date.now() - selectedUserPlan.startDate) / (1000 * 60 * 60 * 24))
  }

  if (!selectedPlanId || !selectedPlan || !selectedUserPlan) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            Reading Plans
          </h1>
          <p className="text-muted-foreground">
            Build consistent Bible reading habits with structured daily plans
          </p>
        </div>

        {activeUserPlans.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Your Active Plans
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {activeUserPlans.map(userPlan => {
                const plan = readingPlans.find(p => p.id === userPlan.planId)
                if (!plan) return null
                
                const progress = (userPlan.completedDays.length / plan.duration) * 100
                
                return (
                  <Card key={userPlan.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedPlanId(plan.id)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <CardDescription className="mt-1">{plan.description}</CardDescription>
                        </div>
                        {userPlan.paused && (
                          <Badge variant="secondary">Paused</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{userPlan.completedDays.length} / {plan.duration} days</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CalendarBlank size={16} />
                            <span>Started {new Date(userPlan.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ListChecks size={16} />
                            <span>{Math.round(progress)}% complete</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
              Available Plans
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {readingPlans.map(plan => {
              const isActive = activeUserPlans.some(up => up.planId === plan.id)
              
              return (
                <Card key={plan.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={plan.category === 'chronological' ? 'default' : 'secondary'}>
                        {plan.category}
                      </Badge>
                      <Badge variant="outline">{plan.duration} days</Badge>
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <Button 
                      onClick={() => startPlan(plan.id)}
                      variant={isActive ? 'secondary' : 'default'}
                      className="w-full"
                    >
                      <Play size={16} weight="fill" className="mr-2" />
                      {isActive ? 'Continue Plan' : 'Start Plan'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const currentDayReading = getCurrentDayReading()
  const progress = getProgressPercentage()
  const daysElapsed = getDaysElapsed()

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setSelectedPlanId(null)} className="mb-4">
          ← Back to Plans
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              {selectedPlan.name}
            </h1>
            <p className="text-muted-foreground">{selectedPlan.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={togglePause}>
              {selectedUserPlan.paused ? (
                <>
                  <Play size={16} weight="fill" />
                  <span className="ml-2">Resume</span>
                </>
              ) : (
                <>
                  <Pause size={16} weight="fill" />
                  <span className="ml-2">Pause</span>
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={resetPlan}>
              <ArrowCounterClockwise size={16} />
              <span className="ml-2">Reset</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{Math.round(progress)}%</div>
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">
              {selectedUserPlan.completedDays.length} of {selectedPlan.duration} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Days Elapsed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{daysElapsed}</div>
            <p className="text-sm text-muted-foreground">
              Since {new Date(selectedUserPlan.startDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {selectedUserPlan.completedDays.length > 0 ? '🔥 Active' : 'Start Today'}
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedUserPlan.completedDays.length} days completed
            </p>
          </CardContent>
        </Card>
      </div>

      {currentDayReading && !selectedUserPlan.paused && (
        <Card className="mb-6 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={24} weight="duotone" className="text-accent" />
              Today's Reading - Day {currentDayReading.day}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentDayReading.readings.map((reading, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Circle size={20} className="text-muted-foreground" />
                  <span className="font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                    {getBookDisplayName(reading.workId)} {reading.chapterNumber}
                  </span>
                </div>
              ))}
              <Button 
                onClick={() => markDayComplete(currentDayReading.day)}
                className="w-full mt-4"
                disabled={selectedUserPlan.completedDays.includes(currentDayReading.day)}
              >
                {selectedUserPlan.completedDays.includes(currentDayReading.day) ? (
                  <>
                    <CheckCircle size={20} weight="fill" className="mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} className="mr-2" />
                    Mark Complete
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Days</CardTitle>
          <CardDescription>Track your progress through the entire plan</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-2">
                  {selectedPlan.days.map((day) => {
                    const isCompleted = selectedUserPlan.completedDays.includes(day.day)
                    const isCurrent = day.day === currentDayReading?.day
                    
                    return (
                      <div 
                        key={day.day}
                        className={`border rounded-lg p-4 transition-colors ${
                          isCurrent ? 'border-accent bg-accent/5' : ''
                        } ${isCompleted ? 'bg-muted/30' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle size={24} weight="fill" className="text-accent" />
                            ) : (
                              <Circle size={24} className="text-muted-foreground" />
                            )}
                            <div>
                              <h3 className="font-semibold">Day {day.day}</h3>
                              {isCurrent && <Badge variant="outline" className="mt-1">Today</Badge>}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={isCompleted ? 'secondary' : 'default'}
                            onClick={() => markDayComplete(day.day)}
                          >
                            {isCompleted ? 'Undo' : 'Complete'}
                          </Button>
                        </div>
                        <div className="ml-9 space-y-1">
                          {day.readings.map((reading, idx) => (
                            <div key={idx} className="text-sm text-muted-foreground">
                              • {getBookDisplayName(reading.workId)} {reading.chapterNumber}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="calendar">
              <div className="grid grid-cols-7 gap-2">
                {selectedPlan.days.map((day) => {
                  const isCompleted = selectedUserPlan.completedDays.includes(day.day)
                  const isCurrent = day.day === currentDayReading?.day
                  
                  return (
                    <button
                      key={day.day}
                      onClick={() => markDayComplete(day.day)}
                      className={`aspect-square p-2 rounded-lg border transition-all hover:border-accent ${
                        isCompleted ? 'bg-accent/20 border-accent' : 'bg-muted/20'
                      } ${isCurrent ? 'ring-2 ring-accent' : ''}`}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-xs font-medium mb-1">{day.day}</span>
                        {isCompleted && <CheckCircle size={16} weight="fill" className="text-accent" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
