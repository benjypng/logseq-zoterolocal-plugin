import { ZotItem } from './interfaces'

export const ITEM_URL = 'http://127.0.0.1:23119/api/users/0/items'
export const COLLECTIONS_URL = 'http://127.0.0.1:23119/api/users/0/collections'
export const ZOTERO_LIBRARY_ITEM = 'zotero://select/library/items?itemKey='

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
