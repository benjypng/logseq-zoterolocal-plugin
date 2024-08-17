import { ZOTERO_LIBRARY_ITEM } from '../constants'
import { getCiteKey } from '../features/items-table/create-columns'
import { ZotData, ZotItem } from '../interfaces'

export const mapItems = async (
  allZotItems: ZotItem[],
  notes: ZotItem[],
): Promise<ZotData[]> => {
  // Note: When used to retrieve query items, notes are actually not retrieved and does not appear in the ZotItem[]
  const parentItems: ZotItem[] = []
  const attachments: ZotItem[] = []

  // Map attachment (see note above)
  for (const item of allZotItems) {
    if (!item.data.parentItem) {
      parentItems.push(item)
    } else {
      attachments.push(item)
    }
  }

  const parentZotData: ZotData[] = parentItems.map((item) => ({
    ...item.data,
    attachments: [],
    citeKey: '',
    inGraph: false,
    libraryLink: '',
    notes: [],
  }))

  for (const item of parentZotData) {
    // Map citeKey
    const title = item.title
    const citeKey = getCiteKey(item.extra)
    item.citeKey = citeKey ?? 'N/A'

    // Map "if in graph"
    const pageToCheck = (logseq.settings!.pagenameTemplate as string)
      .replace('<% citeKey %>', citeKey ?? '$&')
      .replace('<% title %>', title)

    const page = await logseq.Editor.getPage(pageToCheck)
    item.inGraph = !!page

    // Map libraryLink
    item.libraryLink = `${ZOTERO_LIBRARY_ITEM}${item.key}`

    // Map attachment
    for (const attachment of attachments) {
      // itemType: 'attachment'

      if (
        attachment.data.parentItem === item.key &&
        attachment.links.enclosure
      ) {
        item.attachments.push(attachment.links.enclosure)
      }
    }

    for (const note of notes) {
      // itemType: 'note'
      if (
        note.data.parentItem === item.key &&
        note.data.itemType === 'note' &&
        note.data.note
      ) {
        item.notes.push({ note: note.data.note })
      }
    }
  }

  return parentZotData
}
