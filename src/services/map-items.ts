import { ZotItem } from '../features/main/interfaces'
import { replaceTemplateWithValues } from './replace-template-with-values'

export const checkInGraph = async (query: string) => {
  return (await logseq.Editor.getPage(query.toLowerCase())) ? true : false
}

export const mapItems = async (data: ZotItem[]) => {
  const parentItems: ZotItem[] = []
  const attachments: ZotItem[] = []

  data.forEach((item: ZotItem) => {
    if (!item.data.parentItem) {
      parentItems.push(item)
    } else {
      attachments.push(item)
    }
  })

  for (const item of parentItems) {
    item.data.attachments = []
    // Map citeKey
    const citeKey = /Citation Key: ([^\s\n]+)/.exec(item.data.extra)
    if (citeKey && citeKey[1]) item.data['citeKey'] = citeKey[1]

    // Map "if in graph"
    const pageName = await replaceTemplateWithValues(
      logseq.settings!.pagenameTemplate as string,
      item.data,
    )
    item.data['inGraph'] = await checkInGraph(pageName)

    // Map attachment
    for (const attachment of attachments) {
      if (
        attachment.data.parentItem === item.key &&
        attachment.links.enclosure
      ) {
        item.data.attachments.push(attachment.links.enclosure)
      }
    }
  }

  return parentItems.map((item) => item.data)
}
