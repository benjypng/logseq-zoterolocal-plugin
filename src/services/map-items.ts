import { ZOTERO_LIBRARY_ITEM } from '../constants'
import { getCiteKey } from '../features/items-table/Columns'
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

      // linkMode: 'imported_file'
      if (
        noteAttachment.data.itemType === 'attachment' &&
        noteAttachment.data.parentItem === item.key &&
        noteAttachment.data.linkMode === 'imported_file' &&
        noteAttachment.links.enclosure
      ) {
        item.attachments.push({
          linkMode: 'imported_file',
          ...noteAttachment.links.enclosure,
        })
      }

      // linkMode: 'linked_url'
      if (
        noteAttachment.data.itemType === 'attachment' &&
        noteAttachment.data.parentItem === item.key &&
        noteAttachment.data.linkMode === 'linked_url' &&
        noteAttachment.data.url
      ) {
        item.attachments.push({
          linkMode: 'linked_url',
          title: noteAttachment.data.title,
          url: noteAttachment.data.url,
        })
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
