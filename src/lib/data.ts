import { TranslationEdition, TextWork, HistoricalEvent, VerseUnit } from './types'

export const translations: TranslationEdition[] = [
  {
    id: 'geneva',
    name: 'Geneva Bible',
    shortCode: 'GNV',
    year: 1560,
    philosophy: 'formal-equivalence',
    philosophyScore: 2,
    editors: ['William Whittingham', 'Miles Coverdale', 'Christopher Goodman', 'Anthony Gilby', 'Thomas Sampson'],
    sourceTexts: ['Hebrew Masoretic Text', 'Greek Textus Receptus', 'Tyndale Translation'],
    revisionLineage: ['Tyndale (1526)', 'Great Bible (1539)', 'Geneva (1560)'],
    license: 'Public Domain',
    licenseRestrictions: {
      offlineAllowed: true,
      fullTextAllowed: true
    },
    description: 'The Geneva Bible was the Bible of the Protestant Reformation, featuring extensive marginal notes that explained Reformed theology. It was the primary English Bible for English-speaking Protestants until the King James Version gained popularity. Known for its scholarly accuracy and clear language, it was the Bible brought to America by the Pilgrims.',
    languageCode: 'en'
  },
  {
    id: 'kjv',
    name: 'King James Version',
    shortCode: 'KJV',
    year: 1611,
    philosophy: 'formal-equivalence',
    philosophyScore: 2,
    editors: ['47 scholars in six committees'],
    sourceTexts: ['Hebrew Masoretic Text', 'Greek Textus Receptus', 'Bishops\' Bible'],
    revisionLineage: ['Tyndale (1526)', 'Bishops\' Bible (1568)', 'KJV (1611)'],
    license: 'Public Domain',
    licenseRestrictions: {
      offlineAllowed: true,
      fullTextAllowed: true
    },
    description: 'Commissioned by King James I, the KJV became the most influential English Bible translation. Its majestic prose and poetic language shaped English literature for centuries. Created to replace the Geneva Bible and unify the Church of England, it avoided controversial marginal notes.',
    languageCode: 'en'
  },
  {
    id: 'esv',
    name: 'English Standard Version',
    shortCode: 'ESV',
    year: 2001,
    philosophy: 'optimal-equivalence',
    philosophyScore: 3,
    editors: ['Translation Oversight Committee'],
    sourceTexts: ['Hebrew Biblia Hebraica Stuttgartensia', 'Greek Nestle-Aland 27/28', 'Septuagint'],
    revisionLineage: ['RSV (1952)', 'ESV (2001)'],
    license: 'Crossway Publishing',
    licenseRestrictions: {
      offlineAllowed: true,
      fullTextAllowed: false,
      excerptLimit: 500
    },
    description: 'The ESV aims for word-for-word accuracy while maintaining literary quality. It stands in the Tyndale-King James tradition but uses modern critical Greek and Hebrew texts. Popular among evangelical scholars for study and teaching.',
    languageCode: 'en'
  },
  {
    id: 'niv',
    name: 'New International Version',
    shortCode: 'NIV',
    year: 1978,
    philosophy: 'dynamic-equivalence',
    philosophyScore: 5,
    editors: ['Committee on Bible Translation'],
    sourceTexts: ['Hebrew Biblia Hebraica', 'Greek Nestle-Aland', 'Septuagint'],
    revisionLineage: ['NIV (1978)', 'NIV (1984)', 'NIV (2011)'],
    license: 'Biblica',
    licenseRestrictions: {
      offlineAllowed: true,
      fullTextAllowed: false,
      excerptLimit: 500
    },
    description: 'The NIV uses dynamic equivalence to translate thoughts and ideas rather than word-for-word. It aims for natural contemporary English while remaining faithful to source texts. One of the most widely read modern English translations globally.',
    languageCode: 'en'
  }
]

export const bibleBooks: TextWork[] = [
  {
    id: 'gen',
    title: 'Genesis',
    shortName: 'Gen',
    category: 'law',
    canonStatus: {
      protestant: 'canonical',
      catholic: 'canonical',
      orthodox: 'canonical',
      jewish: 'canonical',
      ethiopian: 'canonical'
    },
    chaptersCount: 50,
    compositionDate: '~1400-500 BCE',
    compositionConfidence: 'debated',
    traditionalAuthor: 'Moses',
    introduction: 'Genesis opens the biblical library with primordial narratives of creation, early humanity, and the patriarchs Abraham, Isaac, Jacob, and Joseph. The book establishes foundational themes: God as creator, human rebellion, covenant promises, and divine redemption through a chosen people. Scholars debate its composition, with traditional Jewish and Christian views attributing it to Moses, while critical scholarship sees it as woven from multiple ancient sources edited during Israel\'s monarchy and exile.',
    metadata: {
      testament: 'old',
      order: 1
    }
  },
  {
    id: 'exo',
    title: 'Exodus',
    shortName: 'Exod',
    category: 'law',
    canonStatus: {
      protestant: 'canonical',
      catholic: 'canonical',
      orthodox: 'canonical',
      jewish: 'canonical',
      ethiopian: 'canonical'
    },
    chaptersCount: 40,
    compositionDate: '~1400-500 BCE',
    compositionConfidence: 'debated',
    traditionalAuthor: 'Moses',
    introduction: 'Exodus narrates Israel\'s liberation from Egyptian slavery, the giving of the Law at Mount Sinai, and instructions for worship. Central to Jewish identity and Christian theology, it presents God as redeemer and lawgiver. The book includes the Ten Commandments and detailed instructions for the tabernacle. Historical dating of the Exodus event remains debated among scholars.',
    metadata: {
      testament: 'old',
      order: 2
    }
  },
  {
    id: 'mat',
    title: 'Matthew',
    shortName: 'Matt',
    category: 'gospels',
    canonStatus: {
      protestant: 'canonical',
      catholic: 'canonical',
      orthodox: 'canonical',
      jewish: 'non-canonical',
      ethiopian: 'canonical'
    },
    chaptersCount: 28,
    compositionDate: '~70-90 CE',
    compositionConfidence: 'scholarly-consensus',
    traditionalAuthor: 'Matthew the Apostle',
    introduction: 'The Gospel of Matthew presents Jesus as the Jewish Messiah fulfilling Old Testament prophecy. Written for a Jewish-Christian audience, it emphasizes Jesus\' teaching authority through five major discourses, including the Sermon on the Mount. Matthew traces Jesus\' genealogy to Abraham and David, demonstrating his royal and covenantal credentials. The gospel culminates in the Great Commission, sending disciples to all nations.',
    metadata: {
      testament: 'new',
      order: 40
    }
  },
  {
    id: 'rev',
    title: 'Revelation',
    shortName: 'Rev',
    category: 'apocalypse',
    canonStatus: {
      protestant: 'canonical',
      catholic: 'canonical',
      orthodox: 'canonical',
      jewish: 'non-canonical',
      ethiopian: 'canonical'
    },
    chaptersCount: 22,
    compositionDate: '~90-96 CE',
    compositionConfidence: 'scholarly-consensus',
    traditionalAuthor: 'John the Apostle',
    introduction: 'Revelation, the final book of the New Testament, presents apocalyptic visions of cosmic conflict, divine judgment, and ultimate restoration. Written to seven churches in Asia Minor during Roman persecution, it uses rich symbolic imagery drawn from Old Testament prophets. The book\'s interpretation has been debated throughout church history, with readers seeing it as past events, ongoing spiritual realities, future prophecy, or combinations thereof.',
    metadata: {
      testament: 'new',
      order: 66
    }
  }
]

export const sampleVerses: VerseUnit[] = [
  {
    id: 'gen-1-1-geneva',
    workId: 'gen',
    chapterNumber: 1,
    verseNumber: 1,
    translationId: 'geneva',
    text: 'In the beginning God created the heaven and the earth.',
    crossReferences: ['joh-1-1', 'heb-11-3']
  },
  {
    id: 'gen-1-1-kjv',
    workId: 'gen',
    chapterNumber: 1,
    verseNumber: 1,
    translationId: 'kjv',
    text: 'In the beginning God created the heaven and the earth.'
  },
  {
    id: 'gen-1-1-esv',
    workId: 'gen',
    chapterNumber: 1,
    verseNumber: 1,
    translationId: 'esv',
    text: 'In the beginning, God created the heavens and the earth.'
  },
  {
    id: 'gen-1-1-niv',
    workId: 'gen',
    chapterNumber: 1,
    verseNumber: 1,
    translationId: 'niv',
    text: 'In the beginning God created the heavens and the earth.'
  },
  {
    id: 'joh-3-16-geneva',
    workId: 'joh',
    chapterNumber: 3,
    verseNumber: 16,
    translationId: 'geneva',
    text: 'For God so loveth the world, that he hath given his only begotten Son, that whosoever believeth in him, should not perish, but have everlasting life.'
  },
  {
    id: 'joh-3-16-kjv',
    workId: 'joh',
    chapterNumber: 3,
    verseNumber: 16,
    translationId: 'kjv',
    text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.'
  },
  {
    id: 'joh-3-16-esv',
    workId: 'joh',
    chapterNumber: 3,
    verseNumber: 16,
    translationId: 'esv',
    text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.'
  },
  {
    id: 'joh-3-16-niv',
    workId: 'joh',
    chapterNumber: 3,
    verseNumber: 16,
    translationId: 'niv',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'
  }
]

export const timelineEvents: HistoricalEvent[] = [
  {
    id: 'event-creation-narrative',
    title: 'Creation Narrative Era',
    date: '~4000-2000 BCE (Traditional)',
    dateConfidence: 'traditional',
    era: 'Primordial',
    category: 'narrative',
    description: 'Traditional dating places the creation accounts and early Genesis narratives in this period. Modern scholarship views these as theological narratives compiled much later, drawing on ancient Near Eastern creation traditions.',
    sources: [
      {
        id: 'src-gen-dating',
        title: 'Genesis dating debates',
        notes: 'Traditional vs critical scholarship perspectives'
      }
    ],
    relatedWorks: ['gen'],
    tradition: 'jewish'
  },
  {
    id: 'event-exodus',
    title: 'Exodus from Egypt',
    date: '~1446 BCE or ~1260 BCE',
    dateConfidence: 'debated',
    era: 'Bronze Age',
    category: 'narrative',
    description: 'The biblical account places Israel\'s departure from Egypt and wilderness wandering in this era. Archaeological evidence for the Exodus remains debated, with scholars proposing various dates or viewing it as theological narrative rather than historical event.',
    sources: [
      {
        id: 'src-exodus-dating',
        title: 'Exodus dating debates',
        author: 'Various scholars',
        notes: 'Early date (1446 BCE) vs late date (1260 BCE) theories'
      }
    ],
    relatedWorks: ['exo'],
    tradition: 'jewish'
  },
  {
    id: 'event-torah-composition',
    title: 'Torah Composition and Editing',
    date: '~900-400 BCE',
    dateConfidence: 'scholarly-consensus',
    era: 'Iron Age',
    category: 'composition',
    description: 'Critical scholarship dates the compilation and editing of the Torah (Genesis-Deuteronomy) to this period, drawing on earlier oral and written traditions. The Documentary Hypothesis proposes multiple sources woven together during Israel\'s monarchy and exile.',
    sources: [
      {
        id: 'src-documentary-hypothesis',
        title: 'Documentary Hypothesis',
        author: 'Julius Wellhausen',
        year: 1878
      }
    ],
    relatedWorks: ['gen', 'exo'],
    tradition: 'jewish'
  },
  {
    id: 'event-septuagint',
    title: 'Septuagint Translation',
    date: '~250 BCE',
    dateConfidence: 'scholarly-consensus',
    era: 'Hellenistic Period',
    category: 'canon-formation',
    description: 'Greek-speaking Jews in Alexandria translated Hebrew scriptures into Greek, creating the Septuagint (LXX). This translation became the Old Testament for early Christians and influenced New Testament quotations.',
    sources: [
      {
        id: 'src-septuagint',
        title: 'Letter of Aristeas',
        notes: 'Ancient account of translation origins'
      }
    ],
    relatedWorks: ['gen', 'exo'],
    tradition: 'jewish'
  },
  {
    id: 'event-jamnia',
    title: 'Council of Jamnia (Traditional)',
    date: '~90-100 CE',
    dateConfidence: 'debated',
    era: 'Roman Period',
    category: 'canon-formation',
    description: 'Traditionally cited as when Jewish scholars finalized the Hebrew Bible canon, though modern scholarship questions whether a formal council occurred. The rabbinic discussions at Jamnia did address scriptural debates.',
    sources: [
      {
        id: 'src-jamnia-debate',
        title: 'Jamnia hypothesis debate',
        notes: 'Questioning traditional narrative of canon closure'
      }
    ],
    relatedWorks: [],
    tradition: 'jewish'
  },
  {
    id: 'event-jerome-vulgate',
    title: 'Jerome\'s Vulgate Translation',
    date: '382-405 CE',
    dateConfidence: 'scholarly-consensus',
    era: 'Late Antiquity',
    category: 'community-history',
    description: 'Jerome translated the Bible into Latin from Hebrew and Greek sources, creating the Vulgate that became the Catholic Church\'s standard text for over a millennium.',
    sources: [
      {
        id: 'src-vulgate',
        title: 'Jerome\'s letters and prefaces',
        author: 'Jerome'
      }
    ],
    relatedWorks: [],
    tradition: 'catholic'
  },
  {
    id: 'event-tyndale',
    title: 'Tyndale\'s English Translation',
    date: '1526',
    dateConfidence: 'scholarly-consensus',
    era: 'Reformation',
    category: 'community-history',
    description: 'William Tyndale\'s groundbreaking English translation from Hebrew and Greek laid the foundation for all subsequent English Bibles, including the Geneva and King James versions. Tyndale was executed for heresy in 1536.',
    sources: [
      {
        id: 'src-tyndale',
        title: 'Tyndale biography',
        author: 'David Daniell',
        year: 1994
      }
    ],
    relatedWorks: [],
    tradition: 'protestant'
  },
  {
    id: 'event-geneva-bible',
    title: 'Geneva Bible Published',
    date: '1560',
    dateConfidence: 'scholarly-consensus',
    era: 'Reformation',
    category: 'community-history',
    description: 'English Protestant exiles in Geneva produced this landmark translation with extensive Reformed theological notes. It became the Bible of English Puritans, Scottish Presbyterians, and American colonists, remaining dominant until the KJV gained popularity.',
    sources: [
      {
        id: 'src-geneva',
        title: 'The Geneva Bible: A facsimile',
        year: 1969
      }
    ],
    relatedWorks: [],
    tradition: 'protestant'
  },
  {
    id: 'event-kjv',
    title: 'King James Version Published',
    date: '1611',
    dateConfidence: 'scholarly-consensus',
    era: 'Early Modern',
    category: 'community-history',
    description: 'Commissioned by King James I to create an authoritative English Bible without controversial notes, 47 scholars produced a translation that became the most influential English Bible, shaping language and literature for centuries.',
    sources: [
      {
        id: 'src-kjv',
        title: 'God\'s Secretaries',
        author: 'Adam Nicolson',
        year: 2003
      }
    ],
    relatedWorks: [],
    tradition: 'protestant'
  },
  {
    id: 'event-dead-sea-scrolls',
    title: 'Dead Sea Scrolls Discovery',
    date: '1947-1956',
    dateConfidence: 'scholarly-consensus',
    era: 'Modern',
    category: 'canon-formation',
    description: 'Discovery of ancient Hebrew manuscripts at Qumran provided the oldest known biblical texts, confirming the remarkable accuracy of medieval Hebrew manuscripts while revealing some textual variations.',
    sources: [
      {
        id: 'src-dss',
        title: 'The Dead Sea Scrolls',
        author: 'Geza Vermes',
        year: 1997
      }
    ],
    relatedWorks: [],
    tradition: 'jewish'
  }
]
