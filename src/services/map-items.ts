import { ZotItem } from '../features/main/interfaces'
import { replaceTemplateWithValues } from './replace-template-with-values'

export const checkInGraph = async (query: string) => {
  const page = await logseq.Editor.getPage(query)
  return page ? true : false
}

export const mapItems = async (data: ZotItem[]) => {
  const items: ZotItem[] = []
  const attachments: ZotItem[] = []
  data.forEach((item: ZotItem) => {
    if (item.data.itemType === 'attachment') {
      attachments.push(item)
    } else {
      items.push(item)
    }
  })
  for (const item of items) {
    // Map citeKey
    const citeKey = /Citation Key: ([^\s\n]+)/.exec(item.data.extra)
    if (citeKey && citeKey[1]) item.data['citeKey'] = citeKey[1]

    // Map "if in graph"
    item.data['inGraph'] = await checkInGraph(
      replaceTemplateWithValues(
        logseq.settings!.pagenameTemplate as string,
        item.data,
      ),
    )

    // Map attachment
    for (const attachment of attachments) {
      if (attachment.data.parentItem === item.key) {
        item.data['attachment'] = attachment.links.enclosure
      }
    }
  }
  return items.map((item) => item.data)
}
