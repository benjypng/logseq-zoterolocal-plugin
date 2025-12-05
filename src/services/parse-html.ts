import { IBatchBlock } from '@logseq/libs/dist/LSPlugin'

export const parseHtml = (htmlString: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const zotNote = doc.querySelector('div')
  console.log("doc", zotNote)
  const result: IBatchBlock[] = []

  if (!zotNote) {
    return result
  }
  const root: IBatchBlock = {
    content: '',
    children: [],
  }
  for (const element of zotNote.children) {
    // process heading which is the title of the note
    if (element.tagName === 'H1') {
      root.content = element.textContent ? `## ${element.textContent}` : ''
      result.push(root)
    }

    // each <p> is a zetora note/highlight/underline with a citation
    if (element.tagName === 'P') {
      // process paragraph

      const content: string[] = []
      for (const span of element.children) {
        content.push(processZoteroNote(span))
      }

      // process note content
      const pText = Array.from(element.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent)
        .join("\n\r");

      root.children!.push({
        content: content.join(' '),
        children: [{ content: `#+BEGIN_QUOTE\n\r${pText}\n\r#+END_QUOTE` }],
      })
    }
  }
  return result
}

const processZoteroNote = (spanElement: Element): string => {
  const annotationData = spanElement.getAttribute('data-annotation')
  const citationData = spanElement.getAttribute('data-citation')
  console.log('spanElement', spanElement)

  if (!annotationData && !citationData) return spanElement.textContent || ''

  //decode dataAnnotation string then parse as JSON

  const spanClass = spanElement.getAttribute('class')
  switch (spanClass) {
    case 'highlight':
      return `${spanElement.textContent || ''} ${createZoteroLink(annotationData!)}`
    case 'underline':
      return `${spanElement.textContent || ''} ${createZoteroLink(annotationData!)}`
    case 'citation':
      return createZoteroCitationLink(citationData!, spanElement.textContent || '')
    default:
      return ''
  }
}

const createZoteroCitationLink = (citationData: string, content: string) => {
  const decoded = decodeURIComponent(citationData)
  const citationObj = JSON.parse(decoded)
  const itemKey = citationObj.citationItems[0].uris[0].split('/').pop()
  const locator = citationObj.citationItems[0].locator
  const link =  locator ? `zotero://open-pdf/library/items/${itemKey}?page=${locator}`: `zotero://select/library/items/${itemKey}`

  return `[${content}](${link})`
}

const createZoteroLink = (annotationData: string) => {
  const decoded = decodeURIComponent(annotationData)

  const annotationObj = JSON.parse(decoded)
  const attachmentURI = annotationObj.attachmentURI
  const itemId = attachmentURI.split('/').pop()
  const positionValue = annotationObj.position.value // for website
  const pageLabel = annotationObj.pageLabel // for pdf
  const position = pageLabel ? `page=${pageLabel}` : `sel=${positionValue}`

  const annotationKey = annotationObj.annotationKey
  const link =  `zotero://open-pdf/library/items/${itemId}?${position}&annotation=${annotationKey}`
  return `[🔗](${link})`
}
