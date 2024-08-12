import { BlockEntity, IBatchBlock } from '@logseq/libs/dist/LSPlugin'

import { ZotData } from '../features/main/interfaces'
import { replaceTemplateWithValues } from './replace-template-with-values'

export const handleContentBlocks = async (
  blocks: BlockEntity[],
  data: ZotData,
  result: IBatchBlock[],
) => {
  for (const block of blocks) {
    const content = await replaceTemplateWithValues(block.content, data)

    // Below approach assumes that the attachments and notes have no child blocks below the actual template placeholder, which is a fair assumption.
    if (content.includes('||||||')) {
      // Handle notes

      const contentArr = content.split('||||||')
      contentArr.forEach((content) => {
        result.push({
          content: decodeURIComponent(content.trim()),
          children: [],
        })
      })
    } else if (/\[.*?\]\(.*?\)/.test(content)) {
      // Handle attachments

      const attachmentArr = content.split(',')
      attachmentArr.forEach((attachment) => {
        result.push({
          content: attachment.trim(),
          children: [],
        })
      })
    } else {
      const obj = {
        content,
        children: [],
      }
      if (block.children) {
        await handleContentBlocks(
          block.children as BlockEntity[],
          data,
          obj.children,
        )
      }
      result.push(obj)
    }
  }
}
