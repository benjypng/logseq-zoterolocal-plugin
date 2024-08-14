import { GlossaryObj } from '../interfaces'

export const createTemplateGlossary = async (
  glossaryObj: Partial<GlossaryObj>,
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
    'Attachments',
    { sibling: true },
  )
  if (!attachmentsBlk) return

  await logseq.Editor.insertBlock(attachmentsBlk.uuid, '<% attachments %>', {
    sibling: false,
  })

  const notesBlk = await logseq.Editor.insertBlock(
    attachmentsBlk.uuid,
    'Notes',
    { sibling: true },
  )
  if (!notesBlk) return

  await logseq.Editor.insertBlock(notesBlk.uuid, '<% notes %>', {
    sibling: false,
  })
}
