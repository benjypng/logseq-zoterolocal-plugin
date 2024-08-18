import { BlockEntity, IBatchBlock } from '@logseq/libs/dist/LSPlugin'

import { ZotData } from '../interfaces'
import { replaceTemplateWithValues } from './replace-template-with-values'

const parseHTML = (htmlString: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const elements = Array.from(doc.querySelectorAll('h1, p, p > span.highlight'))

  const result: IBatchBlock[] = []
  let tempHighlightEl: IBatchBlock | null = null

  for (const element of elements) {
    if (element.tagName === 'H1') {
      result.push({
        content: element.textContent ?? '',
        children: [],
      })
    } else if (element.tagName === 'P') {
      if (element.querySelector('span.highlight')) {
        tempHighlightEl = {
          content: element.textContent ?? '',
          children: [],
        }
        result[result.length - 1]!.children!.push(tempHighlightEl!)
      } else {
        if (!tempHighlightEl) {
          result.push({
            content: element.textContent ?? '',
            children: [],
          })
        } else {
          tempHighlightEl?.children!.push({
            content: element.textContent ?? '',
            children: [],
          })
        }
      }
    }
  }
  return result
}

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
        if (content.length === 0) return
        const blockArr = parseHTML(content)

        if (blockArr.length === 0) {
          result.push({
            content: decodeURIComponent(content.trim()),
            children: [],
          })
        } else if (blockArr.length === 1) {
          result.push(blockArr[0]!)
        } else {
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
