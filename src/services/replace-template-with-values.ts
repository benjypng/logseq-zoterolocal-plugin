import { format, parse, parseISO } from 'date-fns'

import { CreatorItem, ZotData } from '../features/main/interfaces'

export const replaceTemplateWithValues = async (
  template: string,
  data: ZotData | CreatorItem,
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
    } else if (key === 'attachment') {
      if (value.type === 'application/pdf') {
        result = result.replace(placeholder, `![${value.title}](${value.href})`)
      } else {
        result = result.replace(placeholder, `[${value.title}](${value.href})`)
      }
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
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Skip object values (except arrays)
      // TODO: Handle array and objects that are not attachments nor creators
      continue
    } else {
      result = result.replace(placeholder, value)
    }
  }

  // Remove parentItem since it doesn't exist for non-attachments
  result = result.replace(/^.*<% .+? %>.*$\n?/gm, '')

  return result
}
