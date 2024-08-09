import { ZotItem } from '../features/main/interfaces'

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
    const citeKey = item.data.extra.replace('Citation Key: ', '')
    item.data['citeKey'] = citeKey

    // Map "if in graph"
    item.data['inGraph'] = await checkInGraph(
      (logseq.settings!.useCiteKeyForTitle as string) ?? item.data.title,
    )

    // Map attachment
    for (const attachment of attachments) {
      if (attachment.data.parentItem === item.key) {
        item.data['attachment'] = attachment
      }
    }
  }
  return items.map((item) => item.data)
}
