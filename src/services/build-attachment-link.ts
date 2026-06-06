export const buildAttachmentLink = (att: {
  linkMode?: string
  title: string
  url?: string
  href?: string
}): string => {
  const prefix = logseq.settings?.openAttachmentInline ? '!' : ''
  const target =
    att.linkMode === 'linked_url' ? (att.url ?? '') : (att.href ?? '')
  return `${prefix}[${att.title}](${decodeURI(target)})`
}
