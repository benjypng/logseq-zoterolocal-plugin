import { format, parse, parseISO } from 'date-fns'

import { CollectionItem, CreatorItem, NoteItem, ZotData } from '../interfaces'
import { getCollectionNames } from './get-collection-names'

export const replaceTemplateWithValues = async (
  template: string,
  data: ZotData | CreatorItem,
  collections?: CollectionItem[],
) => {
  const keys = Object.keys(data)

  let result = template

  const { preferredDateFormat } = await logseq.App.getUserConfigs()

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
    } else if (key === 'itemType') {
      result = result.replace(placeholder, `[[${value}]]`)
    } else if (
      key === 'accessDate' ||
      key === 'date' ||
      key === 'dateAdded' ||
      key === 'dateModified'
    ) {
      try {
        result = result.replace(
          placeholder,
          `[[${format(
            parseISO(value) || parse(value, 'yyyy-MM-dd', new Date()),
            preferredDateFormat,
          )}]]`,
        )
      } catch (e) {
        console.log(`logseq-zoterolocal-plugin`, e, `Unable to parse ${value}`)
        result = result.replace(placeholder, value)
      }
    } else if (key === 'attachments') {
      const attachmentArr = []
      for (const attachment of value) {
        let str
        if (attachment.linkMode === 'linked_url') {
          str = `[${encodeURIComponent(attachment.title)}](${attachment.url})`
        }

        if (attachment.linkMode === 'imported_file') {
          str = await replaceTemplateWithValues(
            attachment.type === 'application/pdf'
              ? `![${encodeURIComponent(attachment.title)}](${attachment.href})`
              : `[${encodeURIComponent(attachment.title)}](${attachment.href})`,
            attachment,
          )
        }

        attachmentArr.push(str)
      }
      result = result.replace(placeholder, attachmentArr.join(', '))
    } else if (key === 'creators') {
      const creatorArr = []
      for (const creator of value) {
        const str = await replaceTemplateWithValues(
          logseq.settings!.authorTemplate as string,
          creator,
        )
        creatorArr.push(str)
      }
      result = result.replace(placeholder, creatorArr.join(', '))
    } else if (key === 'notes') {
      result = result.replace(
        placeholder,
        value.length > 1
          ? value.map((note: NoteItem) => note.note).join('||||||') // handle items with > 1 note
          : value[0].note + '||||||', // handles items with only 1 note
      )
    } else if (key === 'tags') {
      const tagsArr = []
      for (const tag of value) {
        const str = `[[${tag.tag}]]`
        tagsArr.push(str)
      }
      result = result.replace(placeholder, tagsArr.join(', '))
    } else if (key === 'collections' && collections) {
      const collectionArr = getCollectionNames(value, collections)
      result = result.replace(placeholder, collectionArr.join(', '))
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Skip object values (except arrays)
      // Handle array and objects that are not attachments, notes, creators
      continue
    } else {
      result = result.replace(placeholder, value)
    }
  }

  // Remove parentItem since it doesn't exist for non-attachments
  result = result.replace(/^.*<% .+? %>.*$\n?/gm, '')

  return result
}
