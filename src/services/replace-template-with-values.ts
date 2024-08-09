import { CreatorItem, ZotData } from '../features/main/interfaces'

export const replaceTemplateWithValues = (
  template: string,
  data: ZotData | CreatorItem,
) => {
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

  // Remove parentItem since it doesn't exist for non-attachments
  result = result.replace(
    new RegExp(`^.*<% ${'parentItem'} %>.*$\n?`, 'gm'),
    '',
  )

  return result
}
