import { BlockEntity, IBatchBlock } from '@logseq/libs/dist/LSPlugin'

import { ZotData } from '../features/main/interfaces'
import { handleContentBlocks } from './handle-content-blocks'
import { replaceTemplateWithValues } from './replace-template-with-values'

export const insertZotIntoGraph = async (zotItem: ZotData) => {
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

  // template[0] will always be the block properties
  const pageProps = replaceTemplateWithValues(template[0]!.content, zotItem)

  const pageName = logseq.settings!.pagenameTemplate as string
  if (!pageName) throw new Error('Unable to derive page name')

  const existingPage = await logseq.Editor.getPage(pageName)
  if (!existingPage) {
    // Create page
    await logseq.Editor.createPage(
      pageName,
      {},
      {
        redirect: true,
        createFirstBlock: false,
        journal: false,
      },
    )

    // Create properties block
    const propsBlock = await logseq.Editor.appendBlockInPage(
      pageName,
      pageProps,
    )

    // Add content from template
    const contentBlockArr = template.slice(1) as BlockEntity[]
    const result: IBatchBlock[] = []
    handleContentBlocks(contentBlockArr, zotItem, result)
    await logseq.Editor.insertBatchBlock(propsBlock!.uuid, result)
  }
  logseq.hideMainUI()
}
