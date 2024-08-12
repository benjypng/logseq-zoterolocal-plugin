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
    if (content.includes('||||||')) {
      // content = decodeURIComponent(content.replace('||||||', '\n'))

      const contentArr = content.split('||||||')
      contentArr.forEach((content) => {
        result.push({
          content,
          children: [],
        })
      })

      // TODO: What if there are nested items under the template placeholder?
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
