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
    abstractNote?: string
    accessDate?: string
    annotationAuthorName?: string
    annotationColor?: string
    annotationComment?: string
    annotationPageLabel?: string
    annotationPosition?: string
    annotationSortIndex?: string
    annotationText?: string
    annotationType?: string
    applicationNumber?: string
    archive?: string
    archiveID?: string
    archiveLocation?: string
    artworkMedium?: string
    artworkSize?: string
    assignee?: string
    audioFileType?: string
    audioRecordingFormat?: string
    billNumber?: string
    blogTitle?: string
    bookTitle?: string
    callNumber?: string
    caseName?: string
    charset?: string
    citationKey?: string
    code?: string
    codeNumber?: string
    codePages?: string
    codeVolume?: string
    collections?: string[]
    committee?: string
    company?: string
    contentType?: string
    country?: string
    court?: string
    creators?: CreatorItem[]
    date?: string
    dateAdded: string
    dateModified: string
    day?: string
    distributor?: string
    docketNumber?: string
    DOI?: string
    edition?: string
    email?: string
    encyclopediaTitle?: string
    extra?: string
    filingDate?: string
    filename?: string
    firstPage?: string
    forumTitle?: string
    genre?: string
    history?: string
    institution?: string
    ISBN?: string
    ISSN?: string
    issue?: string
    issueDate?: string
    issuingAuthority?: string
    itemType: string
    journalAbbreviation?: string
    key: string
    label?: string
    language?: string
    legalStatus?: string
    legislativeBody?: string
    libraryCatalog?: string
    libraryLink?: string
    license?: string
    linkMode?: string
    manuscriptType?: string
    mapType?: string
    md5?: string
    medium?: string
    meetingName?: string
    meetingPlace?: string
    month?: string
    mtime?: number
    network?: string
    note?: string
    numberOfVolumes?: string
    number?: string
    numPages?: string
    pages?: string
    parentItem?: string
    patentNumber?: string
    place?: string
    postType?: string
    presentationType?: string
    publicationTitle?: string
    publisher?: string
    radioProgramTitle?: string
    references?: string
    relations: Record<string, never>
    reportNumber?: string
    reportType?: string
    repository?: string
    rights?: string
    runningTime?: string
    scale?: string
    section?: string
    series?: string
    seriesNumber?: string
    seriesText?: string
    seriesTitle?: string
    shortTitle?: string
    studio?: string
    subject?: string
    system?: string
    tags: TagItem[]
    thesisType?: string
    title: string
    tvProgramTitle?: string
    university?: string
    url?: string
    version: number
    versionNumber?: string
    videoRecordingFormat?: string
    volume?: string
    websiteTitle?: string
    websiteType?: string
    year?: string
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

/**
ZotData maps Zotero schema to Logseq schema
Handles additional schema that Logseq requires
Or conflicts with Logseq's inbuilt properties
**/
export type ZotData = Omit<ZotItem['data'], 'code' | 'note'> & {
  attachments: AttachmentItem[] | undefined
  citeKey: string
  inGraph: boolean
  libraryLink: string | undefined
  notes: NoteItem[] | undefined
  'zotero-code': string | undefined
}

export interface URLItem {
  title: string
  url: string
}

export interface FileItem {
  href: string
  length: number
  title: string
  type: string
}

interface AttachmentBase {
  key: string
  annotations: AnnotationItem[]
}

export type AttachmentItem =
  | ({
      linkMode: 'linked_url'
    } & URLItem &
      AttachmentBase)
  | ({
      linkMode: 'imported_file'
    } & FileItem &
      AttachmentBase)

export interface CollectionItem {
  key: string
  name: string
}

export interface CreatorItem {
  firstName: string
  lastName: string
  creatorType: string
}

export interface AnnotationItem {
  annotationText: string
  annotationComment: string
  annotationSortIndex: string
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
  libraryLink: string
  notes: string
  pages: string
  parentItem: string
  publicationTitle: string
  relations: string
  shortTitle: string
  tags: string
  itemTitle: string
  url: string
  version: string
  volume: string
}

export type PropertyPreset =
  | 'Minimal'
  | 'Core'
  | 'Academic Extended'
  | 'Full'
  | 'Custom'

export interface PluginSettings {
  testConnection: string
  propertyPreset: string
  pageProps: ZotItem['data']
  agreementClause: boolean
  openAttachmentInline: boolean
  pagenameTemplate: string
  citekeyTemplate: string
  zotTag: string
  zotTemplate: string
  authorTemplate: string
}

export interface ZotRequestOptions {
  url: string
  method: 'GET'
  headers: Record<string, string>
  returnType: 'text'
  includeResponse: true
}

export interface ZotResponse {
  ok: boolean
  status: number
  statusText: string
  url: string
  headers: Record<string, string>
  body: string
}

export type ZotError = Error & { status?: number; body?: string }

export interface ProxyRequestHost {
  baseInfo: { id: string }
  Request: { once: (event: string, cb: (payload: unknown) => void) => unknown }
  _execCallableAPIAsync: (
    method: string,
    ...args: unknown[]
  ) => Promise<unknown>
}
