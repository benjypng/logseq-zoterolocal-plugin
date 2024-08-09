import { GlossaryObj } from '../features/main/interfaces'

export const createTemplateGlossary = async (
  glossaryObj: GlossaryObj,
  uuid: string,
) => {
  let glossaryStr = ''

  Object.entries(glossaryObj).map(
    ([key, value]) =>
      (glossaryStr += `
${key}:: ${value}`),
  )

  const templateRootBlk = await logseq.Editor.insertBlock(uuid, glossaryStr, {
    before: false,
    sibling: false,
  })
  if (!templateRootBlk) return

  const attachmentsBlk = await logseq.Editor.insertBlock(
    templateRootBlk.uuid,
    '[[Attachments]]',
    { sibling: true },
  )
  if (!attachmentsBlk) return

  await logseq.Editor.insertBlock(attachmentsBlk.uuid, '<% attachment %>', {
    sibling: false,
  })
}
