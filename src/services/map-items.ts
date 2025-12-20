import { ZOTERO_LIBRARY_ITEM } from '../constants'
import { getCiteKey } from '../features/items-table/Columns'
import { AttachmentItem, NoteItem, ZotData, ZotItem } from '../interfaces'

export const mapItems = async (
  zotParentItems: ZotItem[],
  noteAndAttachmentItems: ZotItem[],
): Promise<ZotData[]> => {
  /*
   New props required:
   - attachments
   - citeKey
   - inGraph
   - libraryLink
   - notes

   Conflict with inbuilt props:
   - code
   - tags
   */
  const parentZotData = zotParentItems.map((item) => {
    const { code, ...itemDataWithoutConflicts } = item.data

    return {
      ...itemDataWithoutConflicts,
      attachments: [] as AttachmentItem[],
      citeKey: '',
      inGraph: false,
      libraryLink: '',
      notes: [] as NoteItem[],
      'zotero-code': code,
    }
  })

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
    for (const noteAndAttachment of noteAndAttachmentItems) {
      // Only consider when note and attachment has correct parent item
      if (noteAndAttachment.data.parentItem !== item.key) {
        continue
      }

      if (noteAndAttachment.data.itemType === 'attachment') {
        /*
         ITEM TYPE == ATTACHMENT
         */
        if (
          (noteAndAttachment.data.linkMode === 'imported_file' ||
            noteAndAttachment.data.linkMode === 'imported_url') &&
          noteAndAttachment.links.enclosure
        ) {
          item.attachments.push({
            linkMode: 'imported_file',
            ...noteAndAttachment.links.enclosure,
          })
        } else if (
          noteAndAttachment.data.linkMode === 'linked_file' &&
          noteAndAttachment.data.path &&
          noteAndAttachment.data.contentType !== undefined
        ) {
          item.attachments.push({
            linkMode: 'linked_file',
            contentType: noteAndAttachment.data.contentType,
            path: noteAndAttachment.data.path,
            title: noteAndAttachment.data.title,
          })
        } else if (
          noteAndAttachment.data.linkMode === 'linked_url' &&
          noteAndAttachment.data.url
        ) {
          item.attachments.push({
            linkMode: 'linked_url',
            title: noteAndAttachment.data.title,
            url: noteAndAttachment.data.url,
            // every url has a contentType, added for type safety
            contentType: noteAndAttachment.data.contentType ?? '',
          })
        }
      } else if (
        noteAndAttachment.data.itemType === 'note' &&
        noteAndAttachment.data.note
      ) {
        /*
         ITEM TYPE == NOTE
         */
        item.notes.push({ note: noteAndAttachment.data.note })
      }
    }
  }

  return parentZotData
}
