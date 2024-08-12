// DO NOT TOUCH BELOW SECTION //
export interface ZotItem {
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
    up?: {
      href: string
      type: string
    }
    attachment?: {
      href: string
      type: string
      attachmentType: string
      attachmentSize: number
    }
    enclosure?: {
      href: string
      type: string
      title: string
      length: number
    }
  }
  meta: {
    numChildren: number
    creatorSummary?: string
    parsedDate?: string
  }
  data: {
    key: string
    version: number
    itemType: string
    title: string
    parentItem?: string
    abstractNote?: string
    date?: string
    language?: string
    shortTitle?: string
    libraryCatalog?: string
    url?: string
    accessDate?: string
    extra?: string
    note?: string
    linkMode?: string
    contentType?: string
    charset?: string
    filename?: string
    mtime?: number
    md5?: string
    tags: TagItem[]
    collections?: string[]
    relations: Record<string, never>
    dateAdded: string
    dateModified: string
    creators?: CreatorItem[]
    publisher?: string
    ISBN?: string
    pages?: string
    bookTitle?: string
    volume?: string
    publicationTitle?: string
    DOI?: string
    issue?: string
    journalAbbreviation?: string
    ISSN?: string
    repository?: string
    archiveID?: string
  }
}

export interface ZotCollection {
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
  }
  meta: {
    numCollections: number
    numItems: number
  }
  data: {
    key: string
    version: number
    name: string
    parentCollection: boolean
    relations: Record<string, never>
  }
}
// DO NOT TOUCH ABOVE SECTION //

export interface ZotData {
  abstractNote?: string
  accessDate?: string
  archiveID?: string
  bookTitle?: string
  charset?: string
  collections?: CollectionItem[]
  contentType?: string
  creators?: CreatorItem[]
  date?: string
  dateAdded: string
  dateModified: string
  DOI?: string
  extra?: string
  filename?: string
  ISBN?: string
  ISSN?: string
  issue?: string
  itemType: string
  journalAbbreviation?: string
  key: string
  language?: string
  libraryCatalog?: string
  linkMode?: string
  md5?: string
  mtime?: number
  note?: string
  pages?: string
  parentItem?: string
  publicationTitle?: string
  publisher?: string
  relations: Record<string, never>
  repository?: string
  shortTitle?: string
  tags: TagItem[]
  title: string
  url?: string
  version: number
  volume?: string
  // Self created items
  attachments: AttachmentItem[]
  citeKey: string
  inGraph: boolean
  notes: NoteItem[]
}

export interface AttachmentItem {
  href: string
  length: number
  title: string
  type: string
}

export interface CollectionItem {
  key: string
  name: string
}

export interface CreatorItem {
  firstName: string
  lastName: string
  creatorType: string
}

export interface NoteItem {
  note: string
}

export interface TagItem {
  tag: string
}

export interface GlossaryObj {
  accessDate: string
  attachments: string
  citeKey: string
  collections: string
  authors: string
  date: string
  dateAdded: string
  dateModified: string
  DOI: string
  ISSN: string
  ISBN: string
  issue: string
  itemType: string
  journalAbbreviation: string
  key: string
  language: string
  libraryCatalog: string
  notes: string
  pages: string
  parentItem: string
  publicationTitle: string
  relations: string
  shortTitle: string
  tags: string
  title: string
  url: string
  version: string
  volume: string
}
