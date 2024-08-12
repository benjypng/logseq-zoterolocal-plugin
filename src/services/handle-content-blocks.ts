import { BlockEntity, IBatchBlock } from '@logseq/libs/dist/LSPlugin'

import { ZotData } from '../features/main/interfaces'
import { replaceTemplateWithValues } from './replace-template-with-values'

export const handleContentBlocks = async (
  blocks: BlockEntity[],
  data: ZotData,
  result: IBatchBlock[],
) => {
  for (const block of blocks) {
    let content = await replaceTemplateWithValues(block.content, data)
    if (content.includes('||||||')) {
      content = decodeURIComponent(content.replace('||||||', '\n'))
    }

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
