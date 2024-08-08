import '@logseq/libs'

import { handlePopup } from './handle-popup'
import { settings } from './settings'

export interface ZoteroItem {
  key: string
  version: number
  library: {
    type: string
    id: number
    name: string
    links: {
      self: {
        href: string
        type: string
      }
      alternate: {
        href: string
        type: string
      }
    }
  }
  links: {
    self: {
      href: string
      type: string
    }
    alternate: {
      href: string
      type: string
    }
    attachment?: {
      href: string
      type: string
      attachmentType: string
      attachmentSize: number
    }
    up?: {
      href: string
      type: string
    }
    enclosure?: {
      href: string
      type: string
      title: string
      length: number
    }
  }
  meta: {
    creatorSummary: string
    parsedDate: string
    numChildren: number
  }
  data: {
    key: string
    version: number
    itemType: string
    title: string
    date: string
    language: string
    shortTitle?: string
    libraryCatalog: string
    url: string
    accessDate: string
    volume?: string
    pages?: string
    publicationTitle: string
    DOI: string
    issue?: string
    journalAbbreviation?: string
    ISSN?: string
    creators: {
      firstName: string
      lastName: string
      creatorType: string
    }[]
    tags: any[]
    collections: any[]
    relations: any
    dateAdded: string
    dateModified: string
  }
}

const main = async () => {
  console.log('logseq-zoterolocal-plugin loaded')
  // Used to handle any popups
  handlePopup()
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
