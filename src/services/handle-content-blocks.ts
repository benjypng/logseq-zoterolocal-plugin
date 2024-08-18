import { BlockEntity, IBatchBlock } from '@logseq/libs/dist/LSPlugin'

import { ZotData } from '../interfaces'
import { parseHtml } from './parse-html'
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
        // If there is no notes to parse
        if (content.length === 0) return

        const blockArr = parseHtml(content)

        if (blockArr.length === 0) {
          // After parsing, if no special elements are found
          result.push({
            content: decodeURIComponent(content.trim()),
            children: [],
          })
        } else if (blockArr.length === 1) {
          // If only one note is found

          result.push(blockArr[0]!)
        } else {
          // If more than one note is found

          const blockArrRoot = blockArr[0]
          blockArr
            .slice(0)
            .forEach((block) => blockArrRoot?.children!.push(block))
        }
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
