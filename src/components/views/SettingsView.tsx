import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Gear, TextAa, Moon, DownloadSimple, Users, ShieldCheck } from '@phosphor-icons/react'
import { translations } from '@/lib/data'
import type { UserProfile } from '@/lib/types'
import CommunityProfileSettings from '@/components/social/CommunityProfileSettings'
import ModeratorTestPanel from '@/components/social/ModeratorTestPanel'

interface SettingsViewProps {
  userProfile: UserProfile
}

export default function SettingsView({ userProfile: initialProfile }: SettingsViewProps) {
  const [userProfile, setUserProfile] = useKV<UserProfile>('user-profile', initialProfile)

  const updatePreference = <K extends keyof UserProfile['preferences']>(
    key: K,
    value: UserProfile['preferences'][K]
  ) => {
    setUserProfile(current => ({
      ...current!,
      preferences: {
        ...current!.preferences,
        [key]: value
      }
    }))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-foreground flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)' }}>
          <Gear size={32} weight="duotone" className="text-primary" />
          Settings
        </h2>
        <p className="text-muted-foreground">
          Customize your Bible study experience
        </p>
      </div>

      <Tabs defaultValue="reading" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reading" className="gap-2">
            <TextAa size={16} weight="duotone" />
            Reading
          </TabsTrigger>
          <TabsTrigger value="community" className="gap-2">
            <Users size={16} weight="duotone" />
            Community
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <ShieldCheck size={16} weight="duotone" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reading" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TextAa size={24} weight="duotone" className="text-primary" />
              Reading Preferences
            </CardTitle>
            <CardDescription>
              Adjust how scripture text appears
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Font Size: {userProfile?.preferences.fontSize}px</Label>
              <Slider
                value={[userProfile?.preferences.fontSize || 18]}
                onValueChange={(value) => updatePreference('fontSize', value[0])}
                min={12}
                max={28}
                step={1}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Adjust text size for comfortable reading
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Line Spacing: {userProfile?.preferences.lineSpacing}</Label>
              <Slider
                value={[userProfile?.preferences.lineSpacing || 1.75]}
                onValueChange={(value) => updatePreference('lineSpacing', value[0])}
                min={1.2}
                max={2.5}
                step={0.05}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Adjust spacing between lines of text
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={userProfile?.preferences.fontFamily}
                onValueChange={(value) => updatePreference('fontFamily', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Literata">Literata (Default)</SelectItem>
                  <SelectItem value="Crimson Pro">Crimson Pro</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose your preferred reading font
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Verse Numbers</Label>
                <p className="text-sm text-muted-foreground">
                  Show verse numbers in text
                </p>
              </div>
              <Switch
                checked={userProfile?.preferences.verseNumbersVisible}
                onCheckedChange={(checked) => updatePreference('verseNumbersVisible', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Red Letter Text</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight Jesus' words in red
                </p>
              </div>
              <Switch
                checked={userProfile?.preferences.redLetterText}
                onCheckedChange={(checked) => updatePreference('redLetterText', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon size={24} weight="duotone" className="text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Theme and display settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Night Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce eye strain in low light
                </p>
              </div>
              <Switch
                checked={userProfile?.preferences.nightMode}
                onCheckedChange={(checked) => updatePreference('nightMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Translation Preferences</CardTitle>
            <CardDescription>
              Choose your default translation and comparison set
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Default Translation</Label>
              <Select
                value={userProfile?.preferences.defaultTranslation}
                onValueChange={(value) => updatePreference('defaultTranslation', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {translations.map(trans => (
                    <SelectItem key={trans.id} value={trans.id}>
                      {trans.name} ({trans.shortCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Primary translation for reading
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Comparison Set</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Translations to show in comparison view
              </p>
              <div className="flex flex-wrap gap-2">
                {translations.map(trans => {
                  const isSelected = userProfile?.preferences.comparisonSet.includes(trans.id)
                  return (
                    <Badge
                      key={trans.id}
                      variant={isSelected ? 'default' : 'outline'}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => {
                        const current = userProfile?.preferences.comparisonSet || []
                        if (isSelected) {
                          updatePreference('comparisonSet', current.filter(id => id !== trans.id))
                        } else {
                          updatePreference('comparisonSet', [...current, trans.id])
                        }
                      }}
                    >
                      {trans.shortCode}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DownloadSimple size={24} weight="duotone" className="text-primary" />
              Offline Downloads
            </CardTitle>
            <CardDescription>
              Download translations for offline reading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {translations.map(trans => (
                <div key={trans.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <div>
                    <p className="font-medium">{trans.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {trans.year} • {trans.licenseRestrictions.offlineAllowed ? 'Offline available' : 'Streaming only'}
                    </p>
                  </div>
                  <Badge variant={trans.licenseRestrictions.offlineAllowed ? 'default' : 'secondary'}>
                    {trans.licenseRestrictions.offlineAllowed ? 'Downloaded' : 'Limited'}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Some translations have license restrictions that limit offline availability or excerpt length.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Geneva Bible Study</strong> - A scholarly platform for studying the Bible with historical context
            </p>
            <p>
              Version 1.0.0 • Built with reverence for ancient texts and modern scholarship
            </p>
            <Separator className="my-3" />
            <p className="text-xs">
              All translations and texts are used according to their respective licenses and copyrights.
              See individual translation information for specific terms and restrictions.
            </p>
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="community">
          <CommunityProfileSettings />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <ModeratorTestPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
