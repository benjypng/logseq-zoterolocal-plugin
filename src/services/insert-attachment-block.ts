import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

import { AttachmentItem } from '../interfaces'

const getExt = (name: string) => {
  const base = decodeURI(name).split(/[?#]/)[0] ?? ''
  const last = base.split('/').pop() ?? ''
  const dot = last.lastIndexOf('.')
  return dot > 0 ? last.slice(dot + 1).toLowerCase() : ''
}

export const insertAttachmentBlock = async (
  parentUuid: string,
  attachment: AttachmentItem,
): Promise<BlockEntity | null> => {
  const importAsAsset =
    (logseq.settings?.attachmentImportMode as string) === 'Asset'

  let ext: string
  let size = 0
  let assetUrl: string
  let linkUrl: string
  if (attachment.linkMode === 'imported_file') {
    ext = getExt(attachment.title)
    size = attachment.length ?? 0
    assetUrl = attachment.href.replace(/^file:\/\//, 'assets://')
    linkUrl = attachment.href
  } else {
    ext = getExt(attachment.url)
    assetUrl = attachment.url
    linkUrl = attachment.url
  }

  let block: BlockEntity | null
  if (importAsAsset) {
    block = await logseq.Editor.insertBlock(parentUuid, attachment.title, {
      sibling: false,
      properties: {
        'logseq.property.asset/type': ext,
        'logseq.property.asset/external-url': assetUrl,
        'logseq.property.asset/checksum': '',
        'logseq.property.asset/size': size,
      },
    })
  } else {
    const prefix = logseq.settings?.openAttachmentInline ? '!' : ''
    block = await logseq.Editor.insertBlock(
      parentUuid,
      `${prefix}[${attachment.title}](${decodeURI(linkUrl)})`,
      { sibling: false },
    )
  }

  if (!block) return null

  if (importAsAsset) {
    await logseq.Editor.addBlockTag(block.uuid, 'logseq.class/Asset')
  }

  await logseq.Editor.upsertBlockProperty(
    block.uuid,
    'zotero-attachment-key',
    attachment.key,
  )

  return block
}
