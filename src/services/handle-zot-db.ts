import { IBatchBlock } from '@logseq/libs/dist/LSPlugin'
import { format, parse, parseISO } from 'date-fns'

import { ZotData } from '../interfaces'
import { isSchemaAdded } from './is-schema-added'
import { parseHtml } from './parse-html'

export const handleZotInDb = async (zotItem: ZotData, pageName: string) => {
  // Check if citekey has been configured correctly
  if (
    (logseq.settings!.pagenameTemplate as string).includes('<% citeKey %>') &&
    zotItem.citeKey === 'N/A'
  ) {
    //logseq.UI.showMsg(
    //  'Cite key is not configured properly in BetterBibTex',
    //  'error',
    //)
    throw new Error('Citekey has not been configured properly')
  }

  // Check if schema has been added
  const schemaAdded = await isSchemaAdded()
  if (!schemaAdded) {
    await logseq.UI.showMsg(
      'Double-check settings to ensure that all schema has been setup before trying again',
      'error',
    )
    throw new Error()
  }

  // Create page for Zotero item
  let existingPage = await logseq.Editor.getPage(pageName)
  if (existingPage) {
    await logseq.UI.showMsg('Page already exists', 'warning')
    logseq.App.pushState('page', { name: existingPage.name })
    return
  } else {
    //Create page
    existingPage = await logseq.Editor.createPage(
      pageName,
      {},
      {
        redirect: true,
        createFirstBlock: false,
        journal: false,
      },
    )
  }
  if (!existingPage) return

  // Add Zotero tag to page
  await logseq.Editor.addBlockTag(
    existingPage.uuid,
    logseq.settings?.zotTag as string,
  )

  /*
  1. Adds props to page
  2. Adds abstract, attachments and annotations to page
  */

  // Get user-defined props on the fly in case it changes
  const userSelectedPageProps = logseq.settings?.pageProps as string[]
  for (const prop of userSelectedPageProps) {
    console.log('Inserting prop into page', prop)

    let fixedProp = ''
    if (prop !== 'ISSN' && prop !== 'ISBN' && prop !== 'DOI') {
      fixedProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
    } else {
      fixedProp = prop
    }

    // @ts-expect-error need to type later
    const value = zotItem[prop]

    /*******
    Insert properties
    *******/
    if (
      prop === 'inGraph' ||
      prop === 'attachments' ||
      prop === 'abstractNote' ||
      prop === 'notes' ||
      prop === 'version' ||
      prop === 'collections' ||
      prop === 'pages' ||
      prop === 'parentItem' ||
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) || // Empty array
      (typeof value === 'object' && Object.keys(value).length === 0)
    ) {
      continue
      //} else if (prop === 'attachments') {
      //  for (const attachment of value) {
      //    const url = `![${attachment.title}](${decodeURI(attachment.url ?? attachment.href)})`
      //    await logseq.Editor.upsertBlockProperty(
      //      existingPage.uuid,
      //      fixedProp,
      //      url,
      //    )
      //  }
    } else if (
      prop === 'accessDate' ||
      prop === 'dateAdded' ||
      prop === 'dateModified'
    ) {
      const page = await logseq.Editor.createJournalPage(
        format(
          parseISO(value) || parse(value, 'yyyy-MM-dd', new Date()),
          'yyyy-MM-dd',
        ),
      )
      if (!page) continue
      await logseq.Editor.upsertBlockProperty(
        existingPage.uuid,
        fixedProp,
        page.id,
      )
    } else if (prop === 'creators') {
      const creatorPageIds: number[] = []

      for (const creator of value) {
        const page = await logseq.Editor.createPage(
          `${creator.firstName} ${creator.lastName}`,
          {},
          { redirect: false },
        )
        if (page) creatorPageIds.push(page.id)
      }

      for (const id of creatorPageIds) {
        await logseq.Editor.upsertBlockProperty(
          existingPage.uuid,
          'creators',
          id,
        )
      }
    } else if (prop === 'tags') {
      const tagPageIds = []

      for (const t of value) {
        const page = await logseq.Editor.createPage(
          t.tag,
          {},
          { redirect: false },
        )
        if (page) tagPageIds.push(page.id)
      }

      for (const id of tagPageIds) {
        await logseq.Editor.upsertBlockProperty(existingPage.uuid, 'tags', id)
      }
    } else {
      await logseq.Editor.upsertBlockProperty(
        existingPage.uuid,
        fixedProp,
        value,
      )
    }
  }

  /*******
    Insert blocks
    *******/

  let glossaryBatchBlk: IBatchBlock[] = []

  // Insert attachment
  if (zotItem.attachments && zotItem.attachments.length > 0) {
    const attachmentChildBlks = zotItem.attachments.map((attachment) => {
      const inlineModifier = (contentType: string) =>
        logseq.settings?.openAttachmentInline &&
        (contentType === 'application/pdf' ||
        contentType === 'image/png' ||
        contentType === 'image/jpg' ||
        contentType === 'image/jpeg' ||
        contentType === 'image/gif' ||
        contentType === 'image/webp' ||
        contentType === 'image/svg+xml')
          ? '!' : ''

      if (attachment.linkMode === 'linked_url') {
        return {
          content: `${inlineModifier(attachment.contentType)}[${attachment.title}](${decodeURI(attachment.url)})`,
        }
      } else if (attachment.linkMode === 'linked_file') {
        return {
          content: `${inlineModifier(attachment.contentType)}[${attachment.title}](file://${decodeURI(attachment.path)})`,
        }
      } else {
        return {
          content: `${inlineModifier(attachment.type)}[${attachment.title}](${decodeURI(attachment.href)})`,
        }
      }
    })

    glossaryBatchBlk.push({
      content: '## Attachments',
      children: attachmentChildBlks,
    })
  }

  // Insert abstract
  if (zotItem.abstractNote) {
    const abstractBlk = {
      content: '## Abstract',
      children: [
        {
          content: zotItem.abstractNote,
        },
      ],
    }
    glossaryBatchBlk.push(abstractBlk)
  }

  // Insert notes
  if (zotItem.notes && zotItem.notes.length > 0 && zotItem.notes[0]) {
    const htmlBlk = parseHtml(zotItem.notes[0].note)
    glossaryBatchBlk = [...glossaryBatchBlk, ...htmlBlk]
  }

  if (glossaryBatchBlk.length > 0)
    await logseq.Editor.insertBatchBlock(existingPage.uuid, glossaryBatchBlk)
}
