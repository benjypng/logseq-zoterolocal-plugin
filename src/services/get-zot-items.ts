import {
  HttpError,
  ProxyUnavailableError,
  proxy,
} from '@benjypng/logseq-request'

import { BASE_QUERY, ZOT_HEADERS, ZOT_URL } from '../constants'
import {
  AttachmentWithAnnotations,
  CollectionItem,
  ZotCollection,
  ZotItem,
} from '../interfaces'
import { buildAttachmentLink } from './build-attachment-link'
import { mapItems } from './map-items'

const REQUEST_TIMEOUT_MS = 15_000

const buildUrl = (
  path: string,
  query?: Record<string, string | number>,
): string => {
  const url = `${ZOT_URL}${path}`
  if (!query) return url

  const qs = Object.entries(query)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&')

  return qs ? `${url}?${qs}` : url
}

const zotRequest = <T>(
  path: string,
  query?: Record<string, string | number>,
): Promise<T> =>
  proxy(buildUrl(path, query))
    .headers(ZOT_HEADERS)
    .timeout(REQUEST_TIMEOUT_MS)
    .get()
    .json<T>()

const zotErrorMessage = (error: unknown): string => {
  if (error instanceof HttpError) {
    return `❌ Connection error: ${error.message}
Status: ${error.status}
Response: ${error.body}`
  }
  if (error instanceof ProxyUnavailableError) {
    return '❌ Could not connect to Zotero. Check if Zotero is running.'
  }
  return `❌ An unexpected error occurred: ${(error as Error).message}. Check if Zotero is running.`
}

export const testZotConnection = async (): Promise<{
  code: 'success' | 'error'
  msg: string
}> => {
  try {
    await zotRequest('/items', { limit: 1 })
    return { code: 'success', msg: '✅ Connection to Zotero is working' }
  } catch (error) {
    const msg = zotErrorMessage(error)
    logseq.UI.showMsg(msg, 'error')
    return { code: 'error', msg }
  }
}

const getZotItems = async (queryString?: string) => {
  const startTime = performance.now()

  try {
    const searchQuery = queryString
      ? {
          ...BASE_QUERY,
          q: queryString,
          qmode: 'everything',
        }
      : BASE_QUERY

    const [zotParentResultsFromSearch, notesAndAttachments] = await Promise.all(
      [
        zotRequest<ZotItem[]>('/items/top', searchQuery),
        zotRequest<ZotItem[]>('/items', {
          itemType: 'note||attachment||annotation',
        }),
      ],
    )

    const zotDataArr = await mapItems(
      zotParentResultsFromSearch,
      notesAndAttachments,
    )

    const endTime = performance.now()
    console.log(
      'logseq-zoterolocal-plugin: Time taken for query: ',
      (endTime - startTime).toFixed(2),
      'ms',
    )

    return zotDataArr
  } catch (error) {
    logseq.UI.showMsg(zotErrorMessage(error), 'error')
    return []
  }
}

export const getZotItemsFromQueryString = (queryString: string) =>
  getZotItems(queryString)

export const getZotItemsWithoutQueryString = () => getZotItems()

export const getAttachmentsWithAnnotations = async (
  itemKey: string,
): Promise<AttachmentWithAnnotations[]> => {
  const attachments = await zotRequest<ZotItem[]>(
    `/items/${itemKey}/children`,
    { itemType: 'attachment' },
  )

  const result: AttachmentWithAnnotations[] = []

  for (const attachment of attachments) {
    const annotations = await zotRequest<ZotItem[]>(
      `/items/${attachment.data.key}/children`,
      { itemType: 'annotation' },
    )

    const mapped = annotations
      .filter((a) => a.data.annotationText)
      .map((a) => ({
        annotationText: a.data.annotationText ?? '',
        annotationComment: a.data.annotationComment ?? '',
        annotationSortIndex: a.data.annotationSortIndex ?? '',
        annotationPageLabel: a.data.annotationPageLabel ?? '',
        key: a.data.key,
        parentItem: a.data.parentItem ?? attachment.data.key,
      }))

    result.push({
      key: attachment.data.key,
      link: buildAttachmentLink({
        linkMode: attachment.data.linkMode,
        title: attachment.data.title,
        url: attachment.data.url,
        href: attachment.links.enclosure?.href,
      }),
      annotations: mapped,
    })
  }

  return result
}

export const getZotCollections = async (): Promise<CollectionItem[]> => {
  try {
    const allCollectionNames = await zotRequest<ZotCollection[]>('/collections')

    return allCollectionNames.map((item: ZotCollection) => ({
      key: item.data.key,
      name: item.data.name,
    }))
  } catch (error) {
    logseq.UI.showMsg(zotErrorMessage(error), 'error')
    return []
  }
}
