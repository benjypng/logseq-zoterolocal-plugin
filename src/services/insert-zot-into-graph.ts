import { BlockEntity, IBatchBlock } from '@logseq/libs/dist/LSPlugin'

import { CreatorItem, ZotData } from '../features/main/interfaces'

const insertPageContent = async (
  uuid: string,
  blockArr: BlockEntity[],
  zotItem: ZotData,
) => {
  for (let i = 1; i < blockArr.length; i++) {
    const block = await logseq.Editor.insertBlock(
      uuid,
      replaceTemplateWithValues(blockArr[i]!.content, zotItem),
      {
        sibling: false,
        before: false,
      },
    )

    if (!blockArr[i]!.children) continue

    if (blockArr[i]!.children && blockArr[i]!.children!.length > 0)
      await insertPageContent(
        block!.uuid,
        blockArr[i]!.children as BlockEntity[],
        zotItem,
      )
  }
}

const replaceTemplateWithValues = (
  template: string,
  data: ZotData | CreatorItem,
) => {
  console.log('Data', data)
  const keys = Object.keys(data)

  let result = template

  for (const key of keys) {
    const placeholder = new RegExp(`<% ${key} %>`, 'g')
    // @ts-expect-error maybe can type keys later
    const value = data[key]

    if (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) || // Empty array
      (typeof value === 'object' && Object.keys(value).length === 0)
    ) {
      // Remove the entire line if the value is empty
      result = result.replace(new RegExp(`^.*<% ${key} %>.*$\n?`, 'gm'), '')
    } else if (key === 'attachment') {
      result = result.replace(placeholder, `![${value.title}](${value.href})`)
    } else if (key === 'creators') {
      const creatorStr = value
        .map((creator: CreatorItem) =>
          replaceTemplateWithValues(
            logseq.settings!.authorTemplate as string,
            creator,
          ),
        )
        .join(', ')

      result = result.replace(placeholder, creatorStr)
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Skip object values (except arrays)
      // TODO: Handle array and objects that are not attachments nor creators
      continue
    } else {
      result = result.replace(placeholder, value)
    }
  }

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

  // template[0] will always be the block properties
  // TODO: template[1] onwards will need to be gone through recursively.

  const pageProps = replaceTemplateWithValues(template[0]!.content, zotItem)
  console.log(pageProps)

  const pageName = logseq.settings!.useCiteKeyForTitle
    ? zotItem.citeKey
    : zotItem.shortTitle
  if (!pageName) throw new Error('Unable to derive page name')

  const existingPage = await logseq.Editor.getPage(pageName)
  if (!existingPage) {
    //const page = await logseq.Editor.createPage(
    //  pageName,
    //  {},
    //  {
    //    redirect: true,
    //    createFirstBlock: false,
    //    journal: false,
    //  },
    //)
    //const propsBlock = await logseq.Editor.appendBlockInPage(
    //  pageName,
    //  pageProps,
    //)
    //await logseq.Editor.insertBatchBlock(
    //  propsBlock!.uuid,
    //  template.slice(1) as unknown as IBatchBlock,
    //)
    //await insertPageContent(page!.uuid, template, zotItem)
  }

  logseq.hideMainUI()
}
