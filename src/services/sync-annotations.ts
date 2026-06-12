import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

import { ZOTERO_ATTACHMENT_KEY_PROP, ZOTERO_CODE_PROP } from '../constants'
import { buildAnnotationContent } from './build-annotation-content'
import { getAttachmentsWithAnnotations } from './get-zot-items'

const blockText = (b: BlockEntity): string => {
  const e = b as unknown as { content?: string; title?: string }
  return (e.content ?? e.title ?? '').trim()
}

const normalizeHeading = (text: string): string =>
  text.replace(/^#+\s*/, '').trim()

export const syncAnnotations = async (pageName: string) => {
  const pageProps = await logseq.Editor.getPageProperties(pageName)
  if (!pageProps) throw new Error('No page properties found')

  const itemKey = pageProps[ZOTERO_CODE_PROP]
  if (!itemKey) throw new Error('Not a valid Zotero page')

  const attachments = await getAttachmentsWithAnnotations(itemKey as string)
  if (attachments.length === 0) {
    await logseq.UI.showMsg('No attachments found in Zotero', 'warning')
    return
  }

  const blockTree = await logseq.Editor.getPageBlocksTree(pageName)
  if (!blockTree) throw new Error('Could not read page blocks')

  let attachmentsBlock = blockTree.find((b) => {
    const title = normalizeHeading(blockText(b))
    return title === 'Attachments and Annotations' || title === 'Attachments'
  })

  const existingAttachmentBlocks =
    (attachmentsBlock?.children as BlockEntity[] | undefined) ?? []

  const ensureSection = async (): Promise<BlockEntity> => {
    if (attachmentsBlock) return attachmentsBlock
    const lastBlock = blockTree[blockTree.length - 1]
    if (!lastBlock) throw new Error('Page has no blocks')
    attachmentsBlock = (await logseq.Editor.insertBlock(
      lastBlock.uuid,
      '## Attachments and Annotations',
      { sibling: true },
    )) as BlockEntity
    return attachmentsBlock
  }

  let insertedAnnotations = 0
  let insertedComments = 0
  let createdAttachments = 0

  for (const attachment of attachments) {
    let targetBlock: BlockEntity | undefined
    for (const child of existingAttachmentBlocks) {
      const block = child as BlockEntity
      const blockProps = await logseq.Editor.getBlockProperties(block.uuid)
      if (blockProps?.[ZOTERO_ATTACHMENT_KEY_PROP] === attachment.key) {
        targetBlock = block
        break
      }
    }

    if (!targetBlock) {
      const section = await ensureSection()
      const created = await logseq.Editor.insertBlock(
        section.uuid,
        attachment.link,
        { sibling: false },
      )
      if (!created) {
        console.log(
          `logseq-zoterolocal-plugin: Failed to create attachment block for key ${attachment.key}, skipping`,
        )
        continue
      }
      await logseq.Editor.upsertBlockProperty(
        created.uuid,
        'zotero-attachment-key',
        attachment.key,
      )
      targetBlock = created as BlockEntity
      createdAttachments++
    }

    const existingByText = new Map<string, BlockEntity>()
    for (const child of (targetBlock.children as BlockEntity[] | undefined) ??
      []) {
      const block = child as BlockEntity
      existingByText.set(blockText(block), block)
    }

    const sortedAnnotations = [...attachment.annotations].sort((a, b) =>
      a.annotationSortIndex.localeCompare(b.annotationSortIndex),
    )
    for (const annotation of sortedAnnotations) {
      const text = annotation.annotationText.trim()
      if (!text) continue
      const comment = annotation.annotationComment.trim()

      const annotationContent = buildAnnotationContent(annotation)

      const existingBlock = existingByText.get(annotationContent)
      if (existingBlock) {
        if (!comment) continue
        const fresh = await logseq.Editor.getBlock(existingBlock.uuid, {
          includeChildren: true,
        })
        const hasComment = (
          (fresh?.children as BlockEntity[] | undefined) ?? []
        ).some((c) => blockText(c as BlockEntity) === comment)
        if (!hasComment) {
          await logseq.Editor.insertBlock(
            existingBlock.uuid,
            annotation.annotationComment,
            { sibling: false },
          )
          insertedComments++
        }
        continue
      }

      const annotationBlock = await logseq.Editor.insertBlock(
        targetBlock.uuid,
        annotationContent,
        { sibling: false },
      )

      if (annotationBlock) {
        existingByText.set(annotationContent, annotationBlock as BlockEntity)
        if (comment) {
          await logseq.Editor.insertBlock(
            annotationBlock.uuid,
            annotation.annotationComment,
            { sibling: false },
          )
        }
        insertedAnnotations++
      }
    }
  }

  if (
    insertedAnnotations === 0 &&
    insertedComments === 0 &&
    createdAttachments === 0
  ) {
    await logseq.UI.showMsg('No new annotations found', 'warning')
    return
  }

  const page = await logseq.Editor.getPage(pageName)
  if (page) {
    await logseq.Editor.upsertBlockProperty(
      page.uuid,
      'zotero-last-sync',
      Date.now(),
    )
  }

  const parts: string[] = []
  if (insertedAnnotations > 0)
    parts.push(`${insertedAnnotations} new annotation(s)`)
  if (insertedComments > 0) parts.push(`${insertedComments} new comment(s)`)
  if (createdAttachments > 0)
    parts.push(`${createdAttachments} new attachment(s)`)
  await logseq.UI.showMsg(`Synced ${parts.join(' and ')}`, 'success')
}
