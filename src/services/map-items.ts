import { getCiteKey } from '../features/items-table/create-columns'
import { ZotData, ZotItem } from '../interfaces'

export const mapItems = async (data: ZotItem[]): Promise<ZotData[]> => {
  const parentItems: ZotItem[] = []
  const attachments: ZotItem[] = []

  data.forEach((item: ZotItem) => {
    if (!item.data.parentItem) {
      parentItems.push(item)
    } else {
      attachments.push(item)
    }
  })

  const parentZotData: ZotData[] = parentItems.map((item) => ({
    ...item.data,
    attachments: [],
    citeKey: '',
    inGraph: false,
    notes: [],
  }))

  for (const item of parentZotData) {
    // Map citeKey
    const title = item.title
    const citeKey = getCiteKey(item.extra)
    item.citeKey = citeKey ?? 'N/A'

    // Map "if in graph"
    const pageToCheck = (logseq.settings!.pagenameTemplate as string)
      .replace(/Citation Key: ([^\s\n]+)/, citeKey ?? '$&')
      .replace('<% title %>', title)

    const page = await logseq.Editor.getPage(pageToCheck)
    item.inGraph = !!page

    // Map attachment
    for (const attachment of attachments) {
      // itemType: 'attachment'
      if (
        attachment.data.parentItem === item.key &&
        attachment.links.enclosure
      ) {
        item.attachments.push(attachment.links.enclosure)
      }
      // itemType: 'note'
      if (
        attachment.data.parentItem === item.key &&
        attachment.data.itemType === 'note' &&
        attachment.data.note
      ) {
        item.notes.push({ note: attachment.data.note })
      }
    }
  }

  return parentZotData
}
