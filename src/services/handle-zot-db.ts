import { IBatchBlock } from '@logseq/libs/dist/LSPlugin'
import { format, parse, parseISO } from 'date-fns'

import { PROP_PRESETS, ZOT_DATA_KEY_MAP } from '../constants'
import { PropertyPreset, ZotData } from '../interfaces'
import { buildAnnotationContent } from './build-annotation-content'
import { isPageEmpty } from './is-page-empty'
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
    if (!(await isPageEmpty(pageName))) {
      await logseq.UI.showMsg(
        `Skipped: page "${pageName}" already exists and is not empty`,
        'warning',
      )
      logseq.App.pushState('page', { name: existingPage.name })
      return
    }
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

  // Resolve which properties to use based on the selected preset
  const preset = (logseq.settings?.propertyPreset as PropertyPreset) ?? 'Core'
  let userSelectedPageProps: string[]
  if (preset === 'Custom') {
    userSelectedPageProps = logseq.settings?.pageProps as string[]
  } else if (preset === 'Full') {
    userSelectedPageProps = Object.keys(ZOT_DATA_KEY_MAP).filter(
      (prop) =>
        prop !== 'abstractNote' &&
        prop !== 'attachments' &&
        prop !== 'notes' &&
        prop !== 'inGraph',
    )
  } else {
    userSelectedPageProps = [...PROP_PRESETS[preset]]
  }
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
      prop === 'annotations' ||
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

  // Always populate zotero-code (not part of presets, but always needed)
  if (zotItem['zotero-code']) {
    await logseq.Editor.upsertBlockProperty(
      existingPage.uuid,
      'zotero-code',
      zotItem['zotero-code'],
    )
  }

  await logseq.Editor.upsertBlockProperty(
    existingPage.uuid,
    'zotero-last-sync',
    Date.now(),
  )

  /*******
    Insert blocks
    *******/

  let glossaryBatchBlk: IBatchBlock[] = []

  // Insert attachments with annotations — done individually so we can set
  // the zotero-attachment-key property on each attachment block for sync
  if (zotItem.attachments && zotItem.attachments.length > 0) {
    const headerBlock = await logseq.Editor.insertBlock(
      existingPage.uuid,
      '## Attachments and Annotations',
      { sibling: false },
    )

    if (headerBlock) {
      for (const attachment of zotItem.attachments) {
        const link =
          attachment.linkMode === 'linked_url'
            ? `${logseq.settings?.openAttachmentInline ? '!' : ''}[${attachment.title}](${decodeURI(attachment.url)})`
            : `${logseq.settings?.openAttachmentInline ? '!' : ''}[${attachment.title}](${decodeURI(attachment.href)})`

        const attachmentBlock = await logseq.Editor.insertBlock(
          headerBlock.uuid,
          link,
          { sibling: false },
        )

        if (attachmentBlock) {
          // Store the Zotero attachment key for sync matching
          await logseq.Editor.upsertBlockProperty(
            attachmentBlock.uuid,
            'zotero-attachment-key',
            attachment.key,
          )

          // Insert annotations sorted by document position
          const sortedAnnotations = [...attachment.annotations].sort((a, b) =>
            a.annotationSortIndex.localeCompare(b.annotationSortIndex),
          )
          for (const annotation of sortedAnnotations) {
            if (!annotation.annotationText) continue
            const annotationBlock = await logseq.Editor.insertBlock(
              attachmentBlock.uuid,
              buildAnnotationContent(annotation),
              { sibling: false },
            )

            if (annotationBlock && annotation.annotationComment) {
              await logseq.Editor.insertBlock(
                annotationBlock.uuid,
                annotation.annotationComment,
                { sibling: false },
              )
            }
          }
        }
      }
    }
  }

  // Insert abstract
  if (zotItem.abstractNote) {
    const abstractBlk = {
      content: '## Abstract',
      children: [
        {
          content: zotItem.abstractNote
            .split('\n')
            .map((line) => line.replace(/\s+/g, ' ').trim())
            .filter((line) => line.length > 0)
            .join('\n'),
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
