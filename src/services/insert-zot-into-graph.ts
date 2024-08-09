import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

import { ZotData } from '../features/main/interfaces'

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

  const { children: template } = (await logseq.Editor.getBlock(
    templateRoot.uuid,
    {
      includeChildren: true,
    },
  )) as BlockEntity
  if (template!.length === 0) {
    logseq.UI.showMsg(`Please ensure a template is created`, 'error')
    return
  }

  const pageName = logseq.settings!.useCiteKeyForTitle
    ? zotItem.citeKey
    : zotItem.title

  // Create page according to template

  // Go to page
  //logseq.App.pushState('page', {
  //  name: pageName,
  //})
  //logseq.hideMainUI()
}
