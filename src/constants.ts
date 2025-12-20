import { ZotItem } from './interfaces'

export const ZOT_URL = 'http://127.0.0.1:23119/api/users/0'
export const COLLECTIONS_URL = 'http://127.0.0.1:23119/api/users/0/collections'
export const ZOTERO_LIBRARY_ITEM = 'zotero://select/library/items?itemKey='
export const BASE_QUERY = {
  sort: 'dateAdded',
  direction: 'desc',
}

export const FUSE_KEYS = [
  {
    name: 'combinedSearch',
    weight: 1,
    getFn: (obj: ZotItem) => {
      const authors = obj.data.creators
        ? obj.data.creators
            .filter((creator) => creator.creatorType === 'author')
            .map((author) => `${author.firstName} ${author.lastName}`)
            .join(' ')
        : ''
      const year = obj.data.date
        ? new Date(obj.data.date).getFullYear().toString()
        : ''
      return `${authors} ${obj.data.title} ${year}`.trim()
    },
  },
  {
    name: 'creators',
    weight: 0.9,
    getFn: (obj: ZotItem) => {
      return obj.data.creators
        ? obj.data.creators
            .filter((creator) => creator.creatorType === 'author')
            .map((author) => `${author.firstName} ${author.lastName}`)
            .join(' ')
        : ''
    },
  },
  { name: 'title', weight: 0.9 },
  {
    name: 'date',
    weight: 0.7,
  },
  { name: 'abstractNote', weight: 0.3 },
  { name: 'citeKey', weight: 0.6 },
  { name: 'itemType', weight: 0.2 },
  { name: 'journalAbbreviation', weight: 0.4 },
  { name: 'key', weight: 0.5 },
  { name: 'publicationTitle', weight: 0.5 },
  { name: 'shortTitle', weight: 0.4 },
  { name: 'url', weight: 0.3 },
]

export const FUSE_THRESHOLD = 0.6

export const DEBOUNCE_DELAY = 400

export const ZOT_DATA_KEY_MAP = {
  abstractNote: true,
  accessDate: true,
  applicationNumber: true,
  archive: true,
  archiveID: true,
  archiveLocation: true,
  artworkMedium: true,
  artworkSize: true,
  assignee: true,
  audioFileType: true,
  audioRecordingFormat: true,
  billNumber: true,
  blogTitle: true,
  bookTitle: true,
  callNumber: true,
  caseName: true,
  charset: true,
  code: true,
  codeNumber: true,
  codePages: true,
  codeVolume: true,
  collections: true,
  committee: true,
  company: true,
  contentType: true,
  country: true,
  court: true,
  creators: true,
  date: true,
  dateAdded: true,
  dateModified: true,
  day: true,
  distributor: true,
  docketNumber: true,
  DOI: true,
  edition: true,
  email: true,
  encyclopediaTitle: true,
  extra: true,
  filingDate: true,
  filename: true,
  firstPage: true,
  forumTitle: true,
  genre: true,
  history: true,
  institution: true,
  ISBN: true,
  ISSN: true,
  issue: true,
  issueDate: true,
  issuingAuthority: true,
  itemType: true,
  journalAbbreviation: true,
  key: true,
  label: true,
  language: true,
  legalStatus: true,
  legislativeBody: true,
  libraryCatalog: true,
  license: true,
  linkMode: true,
  manuscriptType: true,
  mapType: true,
  md5: true,
  medium: true,
  meetingName: true,
  meetingPlace: true,
  month: true,
  mtime: true,
  network: true,
  note: true,
  numberOfVolumes: true,
  number: true,
  numPages: true,
  pages: true,
  parentItem: true,
  patentNumber: true,
  path: true,
  place: true,
  postType: true,
  presentationType: true,
  publicationTitle: true,
  publisher: true,
  radioProgramTitle: true,
  references: true,
  relations: true,
  reportNumber: true,
  reportType: true,
  repository: true,
  rights: true,
  runningTime: true,
  scale: true,
  section: true,
  series: true,
  seriesNumber: true,
  seriesText: true,
  seriesTitle: true,
  shortTitle: true,
  studio: true,
  subject: true,
  system: true,
  tags: true,
  thesisType: true,
  title: true,
  tvProgramTitle: true,
  university: true,
  url: true,
  version: true,
  versionNumber: true,
  videoRecordingFormat: true,
  volume: true,
  websiteTitle: true,
  websiteType: true,
  year: true,
} satisfies Record<keyof ZotItem['data'], true>
