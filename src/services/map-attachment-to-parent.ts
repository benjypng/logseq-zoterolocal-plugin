import { ZotItem } from '../features/main/interfaces'

export const mapAttachmentToParent = (data: ZotItem[]) => {
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
    for (const attachment of attachments) {
      if (attachment.data.parentItem === item.key) {
        item.data['attachment'] = attachment
      }
    }
  }
  return items.map((item) => item.data)
}
