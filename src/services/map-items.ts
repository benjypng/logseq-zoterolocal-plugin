import { ZOTERO_LIBRARY_ITEM } from '../constants'
import { getCiteKey } from '../features/items-table/create-columns'
import { ZotData, ZotItem } from '../interfaces'

export const mapItems = async (
  zotParentItems: ZotItem[],
  noteAttachmentItems: ZotItem[],
): Promise<ZotData[]> => {
  const parentZotData: ZotData[] = zotParentItems.map((item) => ({
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
    for (const noteAttachment of noteAttachmentItems) {
      // itemType: 'attachment'
      if (
        noteAttachment.data.itemType === 'attachment' &&
        noteAttachment.data.parentItem === item.key &&
        noteAttachment.links.enclosure
      ) {
        item.attachments.push(noteAttachment.links.enclosure)
      }

      // itemType: 'note'
      if (
        noteAttachment.data.parentItem === item.key &&
        noteAttachment.data.itemType === 'note' &&
        noteAttachment.data.note
      ) {
        item.notes.push({ note: noteAttachment.data.note })
      }
    }
  }

  return parentZotData
}
