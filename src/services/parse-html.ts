import { IBatchBlock } from '@logseq/libs/dist/LSPlugin'

export const parseHtml = (htmlString: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const elements = Array.from(doc.querySelectorAll('h1, p, p > span.highlight'))

  const result: IBatchBlock[] = []
  let tempHighlightEl: IBatchBlock | null = null

  for (const element of elements) {
    if (element.tagName === 'H1') {
      result.push({
        content: element.textContent ? `# ${element.textContent}` : '',
        children: [],
      })
    } else if (element.tagName === 'P') {
      if (element.querySelector('span.highlight')) {
        tempHighlightEl = {
          content: element.textContent ?? '',
          children: [],
        }
        result[result.length - 1]!.children!.push(tempHighlightEl!)
      } else {
        if (!tempHighlightEl) {
          result.push({
            content: element.textContent ?? '',
            children: [],
          })
        } else {
          tempHighlightEl?.children!.push({
            content: element.textContent ?? '',
            children: [],
          })
        }
      }
    }
  }
  return result
}
