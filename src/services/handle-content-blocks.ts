import { BlockEntity, IBatchBlock } from '@logseq/libs/dist/LSPlugin'

import { ZotData } from '../features/main/interfaces'
import { replaceTemplateWithValues } from './replace-template-with-values'

export const handleContentBlocks = async (
  blocks: BlockEntity[],
  data: ZotData,
  result: IBatchBlock[],
) => {
  for (const block of blocks) {
    const obj = {
      content: await replaceTemplateWithValues(block.content, data),
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
