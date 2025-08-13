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
      if (noteAttachment.data.itemType === 'attachment' && noteAttachment.data.parentItem === item.key) {
        const attachment = {
          title: noteAttachment.data.title,
          library: noteAttachment.library.type === 'user' ? 'library' : `groups/${noteAttachment.library.id}`,
          key: noteAttachment.data.key
        }
        
        // linkMode: 'imported_file' or 'imported_url'
        if (
          (noteAttachment.data.linkMode === 'imported_file' || noteAttachment.data.linkMode === 'imported_url' ) &&
          noteAttachment.links.enclosure && noteAttachment.data.filename
        ) {
          item.attachments.push({
            ...attachment,
            linkMode: noteAttachment.data.linkMode,
            ...noteAttachment.links.enclosure,
            filename: noteAttachment.data.filename
          })
        }

        // linkMode: 'linked_url'
        else if (
          noteAttachment.data.linkMode === 'linked_url' &&
          noteAttachment.data.url
        ) {
          item.attachments.push({
            ...attachment,
            linkMode: 'linked_url',
            title: noteAttachment.data.title,
            url: noteAttachment.data.url,
          })
        }

        // linkMode: 'linked_file'
        else if (
          noteAttachment.data.linkMode === 'linked_file' &&
          noteAttachment.data.path
        ) {
          item.attachments.push({
            ...attachment,
            linkMode: 'linked_file',
            title: noteAttachment.data.title,
            path: 
              noteAttachment.data.path.startsWith('attachments:') 
                ? noteAttachment.data.path.substring('attachments:'.length) 
                : noteAttachment.data.path
          })
        }
      }

      // itemType: 'note'
      else if (
        noteAttachment.data.itemType === 'note' &&
        noteAttachment.data.parentItem === item.key &&
        noteAttachment.data.note
      ) {
        item.notes.push({ note: noteAttachment.data.note })
      }
    }
  }

  return parentZotData
}
