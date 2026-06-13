import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

const blockText = (b: BlockEntity): string => {
  const e = b as unknown as { content?: string; title?: string }
  return (e.content ?? e.title ?? '').trim()
}

const hasContent = (blocks: BlockEntity[]): boolean =>
  blocks.some((b) => {
    if (blockText(b).length > 0) return true
    const children = (b.children as BlockEntity[] | undefined) ?? []
    return hasContent(children)
  })

const BUILTIN_TAGS = new Set(['Page'])
const TAGS_KEYS = new Set([':block/tags', 'tags'])

const tagTitle = (tag: unknown): string => {
  if (typeof tag === 'string') return tag
  if (tag && typeof tag === 'object') {
    const t = tag as { title?: string; originalName?: string; name?: string }
    return t.title ?? t.originalName ?? t.name ?? ''
  }
  return String(tag)
}

const hasMeaningfulTag = (value: unknown): boolean => {
  const tags = Array.isArray(value) ? value : [value]
  return tags.some((t) => {
    const title = tagTitle(t)
    return title.length > 0 && !BUILTIN_TAGS.has(title)
  })
}

const hasUserProperties = (props: unknown): boolean => {
  if (Array.isArray(props)) {
    return props.some((p) => !BUILTIN_TAGS.has(tagTitle(p)))
  }
  if (props && typeof props === 'object') {
    return Object.entries(props as Record<string, unknown>).some(
      ([key, value]) => (TAGS_KEYS.has(key) ? hasMeaningfulTag(value) : true),
    )
  }
  return false
}

export const isPageEmpty = async (pageName: string): Promise<boolean> => {
  const props = await logseq.Editor.getPageProperties(pageName)
  if (hasUserProperties(props)) return false

  const tree = await logseq.Editor.getPageBlocksTree(pageName)
  if (!tree || tree.length === 0) return true

  return !hasContent(tree)
}
