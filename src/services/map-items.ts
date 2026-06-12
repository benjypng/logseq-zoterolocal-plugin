import { ZOTERO_LIBRARY_ITEM } from '../constants'
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
      'zotero-code': item.key,
    }
  })

  for (const item of parentZotData) {
    // Map citeKey
    const title = item.title
    const citeKey = item.citationKey
    item.citeKey = citeKey ?? 'N/A'

    // Map "if in graph"
    const pageToCheck = (logseq.settings!.pagenameTemplate as string)
      .replace('<% citeKey %>', citeKey ?? '$&')
      .replace('<% title %>', title)
    const page = await logseq.Editor.getPage(pageToCheck)
    item.inGraph = !!page

    // Map libraryLink
    item.libraryLink = `${ZOTERO_LIBRARY_ITEM}${item.key}`

    // First pass: collect attachments (with keys) for this parent item
    const attachmentMap = new Map<string, AttachmentItem>()
    for (const child of noteAndAttachmentItems) {
      if (child.data.parentItem !== item.key) continue
      if (child.data.itemType !== 'attachment') continue

      if (child.data.linkMode === 'imported_file' && child.links.enclosure) {
        const att: AttachmentItem = {
          linkMode: 'imported_file',
          key: child.data.key,
          annotations: [],
          ...child.links.enclosure,
        }
        item.attachments.push(att)
        attachmentMap.set(child.data.key, att)
      } else if (child.data.linkMode === 'linked_url' && child.data.url) {
        const att: AttachmentItem = {
          linkMode: 'linked_url',
          key: child.data.key,
          annotations: [],
          title: child.data.title,
          url: child.data.url,
        }
        item.attachments.push(att)
        attachmentMap.set(child.data.key, att)
      }
    }

    // Second pass: collect notes and assign annotations to their parent attachment
    const attachmentKeys = [...attachmentMap.keys()]
    for (const child of noteAndAttachmentItems) {
      // Only consider direct children or grandchildren (via attachments)
      if (
        child.data.parentItem !== item.key &&
        !attachmentKeys.includes(child.data.parentItem ?? '')
      ) {
        continue
      }

      if (child.data.itemType === 'note' && child.data.note) {
        item.notes.push({ note: child.data.note })
      } else if (child.data.itemType === 'annotation') {
        const parentAttachment = attachmentMap.get(child.data.parentItem ?? '')
        if (parentAttachment) {
          parentAttachment.annotations.push({
            annotationText: child.data.annotationText ?? '',
            annotationComment: child.data.annotationComment ?? '',
            annotationSortIndex: child.data.annotationSortIndex ?? '',
            annotationPageLabel: child.data.annotationPageLabel ?? '',
            key: child.data.key,
            parentItem: child.data.parentItem ?? '',
          })
        }
      }
    }
  }

  return parentZotData
}
