import { ZotData, ZotItem } from '../features/main/interfaces'
import { replaceTemplateWithValues } from './replace-template-with-values'

export const checkInGraph = async (query: string) => {
  return (await logseq.Editor.getPage(query.toLowerCase())) ? true : false
}

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
    collections: [],
    attachments: [],
    citeKey: '',
    inGraph: false,
    notes: [],
  }))

  for (const item of parentZotData) {
    // Map citeKey
    if (item.extra) {
      const citeKey = /Citation Key: ([^\s\n]+)/.exec(item.extra)
      if (citeKey && citeKey[1]) item.citeKey = citeKey[1]
    }

    // Map "if in graph"
    const pageName = await replaceTemplateWithValues(
      logseq.settings!.pagenameTemplate as string,
      item,
    )
    item.inGraph = await checkInGraph(pageName)

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
