import { BlockEntity, IBatchBlock } from '@logseq/libs/dist/LSPlugin'

import { ZotData } from '../interfaces'
import { getZotCollections } from './get-zot-items'
import { handleContentBlocks } from './handle-content-blocks'
import { replaceTemplateWithValues } from './replace-template-with-values'

export const insertZotIntoGraph = async (
  zotItem: ZotData,
  blockOrPageIdentity: string,
  flag: 'page',
) => {
  const msgId = await logseq.UI.showMsg('Inserting into graph...', 'warning')

  const templateName = logseq.settings!.zotTemplate as string
  if (!templateName && templateName.length === 0) {
    logseq.UI.showMsg(
      'Please define a template name in the plugin settings first',
      'error',
    )
    return
  }

  const templateRoot = await logseq.App.getTemplate(templateName)
  if (!templateRoot || templateRoot.properties!.templateIncludingParent) {
    logseq.UI.showMsg(
      `Ensure that the template property 'template-including-parent' is set to false`,
      'error',
    )
    return
  }

  const template = (await logseq.Editor.getBlock(templateRoot.uuid, {
    includeChildren: true,
  }))!.children as BlockEntity[]

  if (template.length === 0) {
    logseq.UI.showMsg(`Please ensure a template is created`, 'error')
    return
  }

  const collections = await getZotCollections()

  // template[0] will always be the block properties
  const pageProps = await replaceTemplateWithValues(
    template[0]!.content,
    zotItem,
    collections,
  )

  const pageName = await replaceTemplateWithValues(
    logseq.settings!.pagenameTemplate as string,
    zotItem,
  )
  if (!pageName) throw new Error('Unable to derive page name')

  const existingPage = await logseq.Editor.getPage(pageName)
  if (!existingPage) {
    //  //Create page
    await logseq.Editor.createPage(
      pageName,
      {},
      {
        redirect: false,
        createFirstBlock: false,
        journal: false,
      },
    )
    //  // Create properties block
    const propsBlock = await logseq.Editor.appendBlockInPage(
      pageName,
      pageProps,
    )
    // Add content from template
    // First block is the properties, which has already been inserted
    const contentBlockArr = template.slice(1) as BlockEntity[]
    const result: IBatchBlock[] = []
    await handleContentBlocks(contentBlockArr, zotItem, result)
    await logseq.Editor.insertBatchBlock(propsBlock!.uuid, result)
    // Insert page reference onto where the slash command came from
    // If insert all, then the below is ignored
    if (flag == 'page') {
      await logseq.Editor.appendBlockInPage(
        blockOrPageIdentity,
        `[[${pageName}]]`,
      )
    } else {
      await logseq.Editor.updateBlock(blockOrPageIdentity, `[[${pageName}]]`)
    }
  }

  logseq.UI.closeMsg(msgId)
  logseq.UI.showMsg('Completed!', 'success')
  logseq.hideMainUI()
}
