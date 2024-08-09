import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

import { ZotData } from '../features/main/interfaces'

const replaceTemplateWithValues = (template: string, data: ZotData) => {
  const keys = Object.keys(data).filter(
    (key) => key !== 'authors' && key !== 'attachment' && key !== 'relations',
  )
  let result = template

  for (const key of keys) {
    const placeholder = new RegExp(`<% ${key} %>`, 'g')
    // @ts-expect-error maybe can type keys later
    const value = data[key]

    if (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      // Remove the entire line if the value is empty
      result = result.replace(new RegExp(`^.*<% ${key} %>.*$\n?`, 'gm'), '')
    } else if (typeof value === 'object' && Array.isArray(value)) {
      // Skip object values (except arrays)
      continue
    } else {
      result = result.replace(placeholder, value)
    }
  }

  result = result.replace(
    /^.*<% (firstName|lastName|creatorType) %>.*$\n?/gm,
    '',
  )

  result = result.replace(/^.*<% attachment %>.*$\n?/gm, '')

  result = result.replace(/^.*<%.*%>.*$\n?/gm, '')

  result = result.replace(/\n{2,}/g, '\n').trim()

  return result
}

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

  const templateStr = replaceTemplateWithValues(template[0].content, zotItem)

  const pageName = logseq.settings!.useCiteKeyForTitle
    ? zotItem.citeKey
    : zotItem.title

  const page = await logseq.Editor.getPage(pageName)
  if (!page) {
    await logseq.Editor.createPage(
      pageName,
      {},
      {
        redirect: true,
        createFirstBlock: false,
        journal: false,
      },
    )
    await logseq.Editor.appendBlockInPage(pageName, templateStr)
  }

  // Create page according to template

  //logseq.hideMainUI()
}
