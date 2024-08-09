import { BlockEntity, IBatchBlock } from '@logseq/libs/dist/LSPlugin'

import { ZotData } from '../features/main/interfaces'
import { replaceTemplateWithValues } from './replace-template-with-values'

export const handleContentBlocks = (
  blocks: BlockEntity[],
  data: ZotData,
  result: IBatchBlock[],
) => {
  for (const block of blocks) {
    const obj = {
      content: replaceTemplateWithValues(block.content, data),
      children: [],
    }
    if (block.children) {
      handleContentBlocks(block.children as BlockEntity[], data, obj.children)
    }
    result.push(obj)
  }
}
