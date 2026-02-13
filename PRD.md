# Product Requirements Document: Geneva Bible Study Platform

A scholarly, offline-capable Bible study application that positions the Geneva Bible as the primary reading text while enabling effortless translation comparison, historical exploration, and understanding of how the biblical canon formed across traditions.

**Experience Qualities**:
1. **Scholarly yet accessible** - Present deep research and historical context without academic jargon, making biblical history approachable for curious newcomers while satisfying serious students
2. **Reverent neutrality** - Respect the text's significance across traditions while maintaining objectivity about translation differences, canon debates, and historical context without theological bias
3. **Typography-first clarity** - Prioritize distraction-free reading with exceptional typography, allowing the ancient texts to speak without visual noise or feature clutter

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This application requires sophisticated data modeling for multi-translation alignment, powerful full-text search across multiple corpora, timeline visualization, offline data synchronization, role-based content curation, and deep-linked navigation across thousands of interconnected passages and historical events.

## Bible API Integration

The application integrates with the **Bolls Life Bible API** (https://bolls.life) to source authentic Bible text. This API provides:

- **License**: Public Domain content
- **No Attribution Required**: Fully permissive for non-commercial and commercial use
- **Available Translations**: 16+ public domain translations including:
  - Geneva Bible (1560) - Public Domain
  - King James Version (1611) - Public Domain
  - World English Bible (2000) - Public Domain
  - Young's Literal Translation (1862) - Public Domain
  - American Standard Version (1901) - Public Domain
  - Bible in Basic English (1949) - Public Domain
  - Darby Translation (1890) - Public Domain
  - Douay-Rheims Bible (1609) - Public Domain
  - Webster's Bible (1833) - Public Domain
  - American King James Version (1999) - Public Domain
  - Lexham English Bible (2012) - Public Domain
  - World Messianic Bible (2014) - Public Domain
  - Plus Latin, Portuguese, and Russian translations
- **Coverage**: Complete Old Testament (39 books) and New Testament (27 books) for all translations
- **Features**:
  - Fetch individual verses
  - Fetch complete chapters
  - Search across translations
  - Multiple translation comparison
  - No API key required
  - Free unlimited access

The API integration is implemented in `/src/lib/bibleApi.ts` with React hooks in `/src/hooks/use-bible-api.ts` for easy consumption throughout the application.

**API Endpoints Used**:
- `GET /get-verse/{translation}/{chapter}/{verse}/{book}/` - Fetch single verse
- `GET /get-chapter/{translation}/{chapter}/{book}/` - Fetch complete chapter
- `GET /search/{translation}/{query}/` - Search Bible text

**Caching Strategy**: Chapter data is cached in local KV storage to minimize API calls and enable offline functionality for previously viewed content.

## Essential Features

### 1. Geneva Bible Primary Reader
- **Functionality**: Full Geneva Bible text with verse-by-verse navigation, quick jump to any book/chapter/verse, adjustable typography settings, and persistent reading position
- **Purpose**: Establishes Geneva as the default reading experience, making this Reformation-era translation accessible for daily study while respecting its historical significance
- **Trigger**: App launch (continues last reading) or explicit book/chapter selection from Library
- **Progression**: Home screen shows Continue Reading card → Tap to open Reader → Geneva text loads at saved position → Scroll with verse anchors → Tap verse for options (note, highlight, compare, context) → Reading position auto-saves → Quick navigation via header tap
- **Success criteria**: Geneva Bible loads in <2s on mid-tier devices; user can navigate to any passage in <3 taps; reading position persists across sessions; typography settings apply immediately

### 2. Side-by-Side Translation Comparison
- **Functionality**: Compare Geneva against ESV, NIV, and KJV variants with synchronized scrolling, verse alignment, and highlighted differences with plain-language explanations
- **Purpose**: Enable students and teachers to quickly understand translation choices, manuscript differences, and theological implications of word selection across major English traditions
- **Trigger**: From any verse in Reader, tap Compare icon; or launch directly from Compare tab with passage selector
- **Progression**: Reader view on verse → Tap Compare → Comparison view opens with Geneva + selected translations (ESV/NIV/KJV) → Synchronized scroll → Tap highlighted differences → Explanation panel shows manuscript basis and translation philosophy → Toggle translations on/off → Share or save comparison set
- **Success criteria**: Comparison view loads aligned verses in <1s; differences are visually clear; explanations cite sources; at least 3 translations can be compared simultaneously

### 3. Bible as Library Navigator
- **Functionality**: Visual bookshelf organization showing Bible as compiled collection with categories (Law, History, Wisdom, Prophets, Gospels, Epistles, Apocalypse, Deuterocanon, Other Works), book introductions, and cross-tradition canon differences
- **Purpose**: Help users understand the Bible as a library compiled over centuries, not a single monolithic book, while respecting different canonical traditions
- **Trigger**: Library tab tap; or from Reader, tap breadcrumb to see book in context
- **Progression**: Library view opens → See shelves for Old Testament, New Testament, Deuterocanon/Apocrypha, Other Works → Tap category to expand → See books with metadata badges (canonical status, composition era) → Tap book for introduction → Tap chapter to read
- **Success criteria**: All 66 Protestant + deuterocanonical + selected other works are browsable; canon tradition badges are clear; introductions load instantly

### 4. Translation Catalog with Metadata
- **Functionality**: Curated guide explaining why translations differ, translation philosophy spectrum (formal vs dynamic equivalence), historical milestones, and per-translation metadata (year, editors, source texts, licenses)
- **Purpose**: Demystify translation work and empower users to make informed choices about which translations to use for different study purposes
- **Trigger**: Settings → Translations; or from Compare view, tap info icon on translation name
- **Progression**: Translations Catalog opens → See spectrum visualization (formal ↔ dynamic equivalence) → Tap translation → See full metadata (year, editors, manuscript basis, known revisions, license) → Read plain-language philosophy explanation → Add/remove from Compare set
- **Success criteria**: All included translations have complete metadata; spectrum placement is accurate; license terms are displayed clearly

### 5. Powerful Cross-Corpus Search
- **Functionality**: Full-text search across all included texts with filters for translation, corpus (Protestant/Catholic/Orthodox canon, other works), book, time period, and metadata facets; shows snippets with verse anchors; fast offline index
- **Purpose**: Enable discovery of themes, phrases, and connections across the entire biblical library and related works, regardless of canonical tradition
- **Trigger**: Search tab tap; or from Reader, tap search icon with current passage pre-filled
- **Progression**: Search view opens → Enter query → Live results appear with filters → Apply corpus/translation/book filters → See results with highlighted snippets → Tap result to jump to passage in Reader → Continue reading or compare → Search history saved
- **Success criteria**: Search returns results in <500ms for downloaded texts; filters work correctly; results show accurate context; supports Boolean operators and phrase search

### 6. Interactive Historical Timeline
- **Functionality**: Zoomable timeline with filters for biblical narrative eras, composition/authorship eras (scholarly vs traditional), canon formation milestones, and community history; every event includes sources and confidence labels
- **Purpose**: Provide structured understanding of how biblical texts emerged, were compiled, and canonized across traditions while clearly distinguishing scholarly consensus from traditional claims
- **Trigger**: Timeline tab tap; or from Reader, tap Context → View Timeline Events
- **Progression**: Timeline opens at overview scale → See major eras (Creation Narrative, Exodus, Monarchy, Exile, Jesus, Early Church, Canon Formation, Reformation, Modern) → Zoom to era → See detailed events with confidence labels → Tap event for full description with citations → Filter by tradition (Jewish, Catholic, Protestant, Orthodox) → Jump to related passages or works
- **Success criteria**: Timeline displays 50+ curated events; confidence labels are consistent; sources are cited; filtering works smoothly; responsive interaction

### 7. Notes, Highlights, and Bookmarks
- **Functionality**: Per-verse or passage-level notes with tags, color-coded highlights, bookmarks with labels, and full-text search within user's own notes
- **Purpose**: Support personal study, sermon prep, and teaching by letting users annotate and organize insights tied to specific passages
- **Trigger**: From Reader, long-press verse or tap verse → Actions menu → Add Note/Highlight/Bookmark
- **Progression**: Reader view → Select verse → Tap Note icon → Note editor opens → Type note with optional tags → Save → Note badge appears on verse → Later, search notes or filter by tag → Jump to passage from note list
- **Success criteria**: Notes save instantly; highlights are visually distinct; notes are searchable; sync works across devices; notes are encrypted locally

### 8. Offline Download Packs
- **Functionality**: Download complete translations, book sets, or curated corpus packs for full offline reading, search, and comparison; manage storage and update packs
- **Purpose**: Enable fully functional Bible study without network dependency, respecting license constraints while maximizing offline capability
- **Trigger**: Settings → Downloads; or first-run prompt to download Geneva Bible pack
- **Progression**: Downloads view opens → See available packs (Geneva complete, ESV complete, NIV complete, Deuterocanon pack, Timeline data) → Tap download → Progress indicator → Download completes → Pack appears as "Available Offline" → Use app fully offline → Later, update pack if new version available
- **Success criteria**: Downloaded texts are fully searchable offline; Compare works offline for downloaded translations; pack sizes are displayed; licenses are enforced

### 9. Accessibility and Reading Settings
- **Functionality**: Font family selection, size adjustment, line spacing, night mode, high-contrast mode, verse number display options, red-letter Jesus quotes toggle, and screen reader optimization
- **Purpose**: Make ancient texts readable for everyone regardless of visual ability, lighting conditions, or reading preferences
- **Trigger**: Settings → Reading; or quick-access font size slider in Reader header
- **Progression**: Reader view → Tap settings icon → Adjust font size slider → Change font family → Toggle night mode → Adjust line spacing → Preview changes live → Close settings → Continue reading with new settings → Settings persist
- **Success criteria**: All settings apply instantly; night mode is WCAG AA compliant; font size range is 12-24pt; settings sync across devices

### 10. Reading Plans with Daily Chapters
- **Functionality**: Structured Bible reading plans with daily chapter assignments, progress tracking, calendar view, streak monitoring, custom plan creation with personalized chapter selections, integration with Bible Reader to open today's chapters directly, and reading plan reminders with notification settings
- **Purpose**: Build consistent Bible reading habits through guided, manageable daily reading assignments that help users systematically engage with Scripture, with flexibility to create personalized plans and seamless integration with the reading experience
- **Trigger**: Reading Plans tab; or from Home, tap "Start a Reading Plan" card; Create Custom Plan button; Configure Reminders button
- **Progression**: Plans view opens → Browse available plans (One Year Canonical, 90 Days NT, Chronological, Gospels, Psalms & Proverbs, Pauline Epistles, Custom Plans) → Tap "Create Custom Plan" to design personalized plan with selected books and chapter distribution → Tap Start Plan → Plan dashboard shows today's reading, progress percentage, days elapsed, and streak → Tap on any chapter in today's reading to jump directly to Bible Reader → Read assigned chapters → Mark day complete → Configure daily reminders with preferred time → Track progress via list or calendar view → Pause/resume as needed → Reset if starting over → Delete custom plans when no longer needed
- **Success criteria**: Users can start multiple plans; create unlimited custom plans with flexible chapter selections; daily readings are clearly displayed and clickable to open in Reader; progress persists across sessions; completion is tracked; calendar view shows at-a-glance progress; plans cover major reading approaches; reminders work across sessions; notifications appear at scheduled times; Reader opens directly to today's reading with one tap

### 11. Social Sharing Features
- **Functionality**: Share favorite verses with beautiful visual cards, share reading progress milestones with friends, create shareable verse images with customizable designs, copy formatted verse text, share reading plan achievements, and view a feed of shared content from your reading community
- **Purpose**: Encourage community engagement and spiritual growth by enabling users to easily share meaningful verses, celebrate reading milestones, and inspire others in their Bible study journey
- **Trigger**: From Reader, tap Share icon on verse; from Reading Plans, tap Share Progress; from Social tab, view community feed; tap Create Image Card to design custom verse image
- **Progression**: Reading verse → Tap Share icon → Choose share type (Text, Image Card, Progress) → For Image Card, select design template (Classic, Modern, Minimalist, Illuminated) and customize colors/fonts → Preview shareable content → Copy link or share to social platforms → Content appears in Social feed → Friends see shared verse or milestone → Tap to read full chapter or start similar plan → Like/comment on shared content → Track sharing statistics
- **Success criteria**: Share dialog opens in <300ms; verse cards generate with high-quality design; multiple visual templates available; copy-to-clipboard works reliably; shareable links load quickly; progress milestones trigger automatic share prompts; social feed updates in real-time; images are optimized for social media platforms

### 12. Friend/Community System
- **Functionality**: Follow other users' reading journeys, send and accept friend requests, view friends' reading progress and activity, discover users through search by name/location/denomination, see detailed reading journey profiles showing current books, active plans, reading streaks, milestones achieved, and recent activity, manage community profile with bio and privacy settings, control visibility of reading progress and friend list
- **Purpose**: Build meaningful connections with other believers, encourage accountability in Bible reading habits, celebrate others' spiritual growth, find study partners with similar interests, create a supportive community around consistent Scripture engagement
- **Trigger**: Social tab → Friends or Find Friends; tap user avatar/name from feed; Settings → Community Profile; from friend's shared content, tap "View Journey"
- **Progression**: Community tab → Browse tabs (Feed, Friends, Find Friends) → Tap Find Friends → Search by name, location, or denomination → View user profiles with reading stats and bio → Send friend request → User accepts request → View friend's reading journey showing current book, active plans (with progress %), reading streak, total chapters read, recent activity timeline, and achieved milestones → Like/comment on their shares → Get inspired by their progress → Manage own community profile in Settings → Set bio, location, denomination → Configure privacy settings (profile visibility, show reading progress, show friends list, allow friend requests) → Profile appears in search results based on privacy settings
- **Success criteria**: Friend requests send/accept instantly; search returns results in <500ms; reading journeys display complete activity history; privacy settings apply immediately; friend connections persist across sessions; mutual friends are calculated and displayed; activity feed shows real-time updates from friends; journey view loads user stats accurately; profile changes save immediately; users can be discovered based on public profile settings

### 13. Private Messaging Between Friends
- **Functionality**: Send and receive private messages with friends to discuss verses and scripture, view conversation threads with message history grouped by date, share verse references directly in messages with formatted verse text and translation info, see unread message counts and read receipts, search conversations, and seamlessly navigate from social feed to message a friend about a shared verse
- **Purpose**: Enable deep spiritual discussions and personal reflections between friends, facilitate meaningful conversations about specific verses and passages, create accountability partnerships through private communication, and build stronger connections within the reading community
- **Trigger**: Messages tab; from Social feed, tap "Message" button on friend's shared verse; from friend's profile/journey, tap message icon; click unread message badge notification
- **Progression**: Tap Messages tab → View conversation list sorted by most recent → See unread counts on conversations → Tap conversation or new friend to start thread → Conversation opens with date-grouped message history → Type message in input field → Press Enter or Send button → Message appears in thread instantly → When sharing verses, verse reference auto-formats with book, chapter, verse, text, and translation → Friend receives message, unread count increments → Friend opens conversation, messages mark as read → Both users can scroll through history → Continue discussion about verses and spiritual insights → Return to list to view other conversations
- **Success criteria**: Messages send in <500ms; unread counts update in real-time; message history loads completely; date grouping is accurate; verse references display formatted with full context; read receipts show when friend views message; conversation list updates with latest message preview; smooth navigation from social feed to messages with friend pre-selected; mobile displays list/thread toggle; desktop shows split-pane with list and thread side-by-side; message persistence works across sessions

### 14. Group Discussions for Bible Study
- **Functionality**: Create and join group discussions with multiple friends for collaborative Bible study, send messages to entire group with verse references, react to messages with emojis (thumbs up, heart, praying hands, fire), view group member lists with roles (admin, moderator, member), customize group with name, description, topic, and related passage/reading plan, control privacy settings (public, friends-only, invite-only), invite additional members to existing groups, share verses from Reader directly to multiple groups, view group information and settings, pin important messages, manage notifications per group, and comprehensive role-based permissions system with granular control over who can post messages, pin content, manage members, and modify settings
- **Purpose**: Foster collaborative Bible study and community fellowship by enabling multiple believers to discuss scripture together with clear role-based authority structures that maintain order while empowering moderators to help manage active communities
- **Trigger**: Groups tab; tap "Create Group" button; from Reader's verse share dialog, select Groups tab to share verse with group; from friend list, invite to existing group; group notification badge; Admin Settings for role management
- **Progression**: Groups tab shows list of joined groups with member counts and recent activity → Tap "Create Group" (creator automatically becomes Admin) → Enter group name, description, optional topic → Choose privacy level and permissions → Select friends to invite as members → Create group → Group thread opens → Members with post permission send messages → Share verses from Reader → Admins and Moderators can pin important messages → View member list showing role badges (Admin/Moderator/Member) → Admins access Admin Settings to promote members to Moderator or Admin roles → Configure group settings: "Allow member invites" (controls if members can invite), "Anyone can post" (if disabled, only Admins/Moderators post), "Enable moderation" → Moderators help manage content by pinning/unpinning and deleting inappropriate messages → Admins can remove members and delete group → Role permissions clearly displayed in Group Info dialog → Members see restricted UI based on their role
- **Success criteria**: Group creator automatically receives Admin role; role changes apply instantly; permissions prevent unauthorized actions with clear error messages; UI elements hide/show based on user role; Admins can promote/demote members; Moderators have content management powers but cannot change roles or delete group; Members see posting restrictions when "Anyone can post" is disabled; pinned messages accessible to all roles; permission info dialog explains all role capabilities; role badges display consistently across member lists; multiple Admins can co-manage group

**Role-Based Permissions System**:
- **Admin Role**: Full control - manage all settings, change member roles, remove members, delete group, pin/unpin messages, delete any message, post messages, react to messages, invite members (always, regardless of settings)
- **Moderator Role**: Content management - pin/unpin messages, delete any message to maintain order, post messages (always), react to messages, invite members (respects group settings)
- **Member Role**: Basic participation - post messages (if "Anyone can post" enabled), react to messages, view content, invite others (only if "Allow member invites" enabled)
- **Permission Details Available**: Tap "Role Permissions" in Group Info to see complete permission matrix for all roles
- **Settings Affect Permissions**: "Anyone can post" setting restricts posting to Admins/Moderators when disabled; "Allow member invites" restricts invites to Admins/Moderators when disabled

### 15. Curator/Admin Content Management
- **Functionality**: Role-based tools for curators to edit metadata, alignment annotations, timeline events, and book introductions with versioned audit logs and reversible changes
- **Purpose**: Maintain content quality and accuracy through community curation while ensuring all edits are transparent and reversible
- **Trigger**: Admin users see "Edit" buttons throughout app; or Admin → Content Management dashboard
- **Progression**: Curator opens passage → Sees Edit Metadata button → Opens editor → Modifies translation alignment note → Adds source citation → Submits → Edit queued for review → Admin approves → Change goes live with audit entry → Later, Admin views change history → Reverts if needed
- **Success criteria**: All curator edits are logged with timestamps and user IDs; changes can be reverted; editing UI is intuitive; non-curators don't see edit controls

## Edge Case Handling

- **Missing verses in translations** - Display placeholder row with explanation that verse is absent in specific manuscript tradition, with link to comparison view showing where it appears in other translations
- **Misaligned verse numbering** - Use flexible alignment map that handles verse splits, merges, and renumbering across traditions; show both numbering systems when they diverge
- **Restricted license translations** - Display clear badge indicating "Streaming Only" or "Limited Excerpts"; gracefully degrade offline experience with cached last-viewed passages only
- **Very long passages (Psalm 119)** - Implement virtual scrolling for performance; show progress indicator; allow quick jump to verse ranges
- **Disputed authorship or dates** - Always display confidence label (Traditional, Scholarly Consensus, Debated) with brief explanation and sources
- **Network loss during download** - Resume download from last checkpoint; show clear error message; allow retry without re-downloading completed data
- **Invalid deep links** - Gracefully redirect to home with toast explaining passage not found; offer search as alternative
- **Quota exceeded (search rate limits)** - Queue searches with visual feedback; implement client-side throttling; cache recent searches
- **User reports error in text** - Provide "Report Issue" button that captures context (translation, passage, device) and queues for curator review with audit trail

## Design Direction

The design should evoke the gravitas and timelessness of ancient manuscripts while feeling thoroughly modern in interaction. Users should sense they're handling something precious yet approachable—like a beautifully restored historical library that's been digitized with reverence. The experience should feel scholarly without being stuffy, rich with detail without overwhelming, and confident in its neutrality. Typography must be exceptional, suggesting both the authority of historical texts and the clarity of contemporary scholarship.

## Color Selection

Inspired by aged vellum, rich leather bindings, and historical manuscript illumination, the palette balances warm neutrals with purposeful accent colors that guide without distracting.

- **Primary Color**: oklch(0.35 0.08 40) - Deep burgundy/maroon suggesting aged leather and historical authority, used for primary actions and key headings
- **Secondary Colors**: oklch(0.78 0.03 70) - Warm parchment beige for cards and elevated surfaces; oklch(0.45 0.06 30) - Darker brown for secondary actions
- **Accent Color**: oklch(0.65 0.15 65) - Warm amber/gold suggesting manuscript illumination, used for highlights, active states, and important discoveries
- **Foreground/Background Pairings**:
  - Background (Warm Off-White oklch(0.96 0.01 80)): Dark Text (oklch(0.25 0.02 40)) - Ratio 11.2:1 ✓
  - Card (Parchment oklch(0.92 0.02 75)): Dark Text (oklch(0.25 0.02 40)) - Ratio 9.8:1 ✓
  - Primary (Deep Burgundy oklch(0.35 0.08 40)): White text (oklch(0.99 0 0)) - Ratio 8.1:1 ✓
  - Accent (Amber oklch(0.65 0.15 65)): Dark text (oklch(0.25 0.02 40)) - Ratio 4.9:1 ✓
  - Muted (Soft Gray oklch(0.85 0.01 70)): Medium Text (oklch(0.45 0.02 40)) - Ratio 5.2:1 ✓

## Font Selection

Typography should bridge historical gravitas with contemporary legibility, using fonts that feel both timeless and refined. Avoid overly decorative choices that impede reading, while ensuring body text has exceptional clarity for extended study.

- **Primary (UI & Labels)**: Crimson Pro - A contemporary interpretation of classical book typefaces with excellent screen rendering, suggesting scholarship without pretension
- **Body Text (Scripture)**: Literata - Designed specifically for long-form reading with generous x-height and careful spacing, feels both traditional and highly readable
- **Monospace (References)**: JetBrains Mono - For verse numbers, citations, and technical metadata, providing clear visual distinction

**Typographic Hierarchy**:
- H1 (App Title/Book Names): Crimson Pro Bold, 32px, tight letter-spacing (-0.02em), line-height 1.2
- H2 (Section Headings): Crimson Pro Semibold, 24px, normal spacing, line-height 1.3
- H3 (Chapter Labels): Crimson Pro Medium, 20px, normal spacing, line-height 1.4
- Body (Scripture Text): Literata Regular, 18px, relaxed spacing (0.01em), line-height 1.75, generous paragraph spacing (1.25em)
- UI Text (Buttons/Labels): Crimson Pro Medium, 16px, normal spacing, line-height 1.5
- Captions (Metadata/Citations): Crimson Pro Regular, 14px, normal spacing, line-height 1.5, muted color
- Verse Numbers: JetBrains Mono Regular, 12px, tabular figures, opacity 0.5

## Animations

Animations should feel like carefully turning pages in a valuable historical volume—purposeful, graceful, and never rushed. Transitions should reinforce spatial relationships between the library structure, reading views, and comparison modes, helping users maintain context as they navigate between thousands of passages.

- **Page transitions**: 350ms ease-in-out with subtle fade and 8px slide, suggesting gentle page turns
- **Comparison panels**: Staggered entrance (100ms delay per panel) to emphasize the layering of translation perspectives
- **Verse highlighting**: 200ms glow animation when tapping verse, using accent color at 20% opacity expanding outward
- **Timeline zoom**: Smooth spring animation (stiffness: 100, damping: 18) when zooming between era scales
- **Search results**: Cascade entrance (50ms stagger) with subtle scale (0.95 → 1.0) suggesting text being revealed
- **Note save**: Brief 150ms scale pulse (1.0 → 1.05 → 1.0) with accent border flash to confirm successful save
- **Bookmark add**: 300ms bookmark icon slides in from right with gentle bounce, suggesting physical bookmark placement
- **Navigation drawer**: 280ms ease-out slide with content fade, maintaining reading focus while revealing structure

## Component Selection

- **Components**: 
  - Tabs (for main navigation bottom bar and Compare view translation selector, Reading Plans tab)
  - Card (for book displays in Library, translation cards in Catalog, timeline event cards, reading plan cards, daily reading display)
  - ScrollArea (for long scripture passages, comparison columns, timeline, reading plan day list)
  - Dialog (for book introductions, translation metadata details, note editing)
  - Sheet (for mobile navigation drawer, quick settings panel)
  - Button (primary for main actions like "Compare" and "Start Plan", secondary for metadata views, ghost for verse actions)
  - Input + Label (for search queries, note editing, passage lookup)
  - Select (for translation picker, canon tradition filter, timeline era selector)
  - Separator (between books in Library, between timeline sections, between plan sections)
  - Badge (for canon status, confidence labels, offline availability indicators, plan categories, plan status)
  - Tooltip (for verse number hover info, icon explanations, abbreviated metadata)
  - Accordion (for book introduction expand/collapse, advanced search filters, settings categories)
  - Toggle (for night mode, red-letter text, verse number visibility)
  - Slider (for font size, line spacing)
  - Popover (for verse context menu with quick actions: note/highlight/compare/bookmark)
  - DropdownMenu (for passage jump navigation, sort options, filter menus)
  - Breadcrumb (for navigation path: Library > Old Testament > Law > Genesis > Chapter 1)
  - Progress (for reading plan completion percentage)
  - Calendar grid (custom component for reading plan calendar view with completion status)

- **Customizations**:
  - Custom `VerseText` component with selectable verses, inline verse numbers, and tap targets for annotations
  - Custom `ComparisonPanel` component managing synchronized scroll across multiple translation columns with diff highlighting
  - Custom `TimelineVisualization` component using D3 for interactive historical timeline with zoom, pan, and era filtering
  - Custom `PassageNavigator` component providing book/chapter/verse picker with autocomplete and recent history
  - Custom `AlignmentDiffView` component showing word-level and phrase-level differences with color coding and explanation tooltips

- **States**:
  - Buttons: Default (primary burgundy with white text), Hover (slightly lighter burgundy with subtle lift shadow), Active (pressed inset effect), Disabled (muted with 50% opacity), Loading (with subtle spinner)
  - Verse text: Default (readable black on off-white), Selected (amber highlight background), Highlighted (user's color choice with 30% opacity), Has Note (subtle amber left border), Bookmarked (burgundy bookmark icon overlay top-right)
  - Cards: Default (parchment with subtle shadow), Hover (slight elevation increase with deeper shadow), Active/Selected (amber left border), Disabled (reduced opacity)
  - Timeline events: Default (card with era color left accent), Hovered (slight scale and shadow), Selected (expanded with full description), Filtered Out (faded 40% opacity)

- **Icon Selection** (from Phosphor Icons):
  - BookOpen (Library/Reader views)
  - Books (Bible as library concept)
  - Columns (Compare view toggle)
  - MagnifyingGlass (Search)
  - Clock (Timeline/History)
  - BookmarkSimple (Bookmarks)
  - NotePencil (Notes)
  - Highlighter (Highlights)
  - Gear (Settings)
  - DownloadSimple (Offline packs)
  - Info (Translation metadata, context)
  - CaretRight/CaretLeft (Chapter navigation)
  - ListNumbers (Verse navigation)
  - TextAa (Typography settings)
  - Moon/Sun (Night mode)
  - Warning (Confidence labels, disputed content)
  - ShareNetwork (Share passage, social features)
  - ArrowsOutSimple (Expand comparison)
  - Funnel (Search filters)
  - Tag (Note tags)
  - Users (Community/Social features)
  - UserPlus (Send friend request)
  - Trophy (Milestones and achievements)
  - Heart (Like/favorite shared content)
  - ChatCircle (Comments on shares, Messages)
  - PaperPlaneTilt (Send message)
  - CalendarCheck (Reading plans)
  - CalendarCheck (Reading Plans)
  - Play/Pause (Start/pause reading plans)
  - CheckCircle/Circle (Plan day completion status)
  - ArrowCounterClockwise (Reset plan)
  - CalendarBlank (Plan start date)
  - ListChecks (Progress tracking)
  - Image (Create verse image card)
  - Copy (Copy verse text)
  - Heart (Like shared content)
  - ChatCircle (Comment on shared content)
  - Users (Social community feed)
  - Trophy (Reading milestones)
  - Export (Share progress)

- **Spacing**: 
  - Consistent 4px base unit (Tailwind's default)
  - Card padding: 24px (p-6) for generous breathing room around scripture
  - Section gaps: 32px (gap-8) between major UI sections
  - Verse line spacing: 1.75 for comfortable extended reading
  - List item spacing: 12px (gap-3) for compact but readable lists
  - Button padding: 12px horizontal, 8px vertical (px-3 py-2) for comfortable tap targets
  - Navigation bar: 64px height on mobile for thumb-friendly bottom tabs, 240px width sidebar on desktop

- **Mobile**:
  - Bottom tab bar (64px height) with 8 main tabs: API Demo, Home, Library, Reading Plans, Compare, Search, Timeline, Social
  - Collapsible settings panel slides up from bottom as Sheet
  - Reader uses full viewport with hidden controls (tap to reveal header/footer)
  - Compare view stacks translations vertically with sticky translation labels
  - Library shows grid of books (2 columns on mobile, 4+ on tablet/desktop)
  - Timeline switches to vertical scrolling with pinch-to-zoom
  - Search filters collapse into a Drawer accessed via filter icon
  - Passage navigator uses full-screen modal with large tap targets for book/chapter selection
  - Typography settings accessible via quick-access button in Reader header (always visible)
  - Reading Plans show daily readings in stacked cards with large completion buttons
  - Calendar view uses 7-column grid with touch-friendly day cells
  - Social feed shows stacked share cards with verse text and engagement options
  - Share dialog provides large tap targets for different share types
  - Desktop: Left sidebar navigation (240px) with persistent access to all sections including Reading Plans and Social, main content area uses max-width 1200px with generous margins

