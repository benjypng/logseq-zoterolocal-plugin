import { BASE_QUERY, ZOT_HEADERS, ZOT_URL } from '../constants'
import {
  AnnotationItem,
  CollectionItem,
  ProxyRequestHost,
  ZotCollection,
  ZotError,
  ZotItem,
  ZotRequestOptions,
  ZotResponse,
} from '../interfaces'
import { mapItems } from './map-items'

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

const zotRequest = async <T>(
  path: string,
  query?: Record<string, string | number>,
): Promise<T> => {
  const options: ZotRequestOptions = {
    url: buildUrl(path, query),
    method: 'GET',
    headers: ZOT_HEADERS,
    returnType: 'text',
    includeResponse: true,
  }

  const host = logseq as unknown as ProxyRequestHost
  const requestClient = host.Request

  const reqID = await host._execCallableAPIAsync(
    'exper_request',
    host.baseInfo.id,
    options,
  )

  const res = (await new Promise<unknown>((resolve) => {
    requestClient.once(`task_callback_${reqID}`, resolve)
  })) as ZotResponse

  if (!res || typeof res.status !== 'number') {
    throw new Error('Could not connect to Zotero. Check if Zotero is running.')
  }

  if (!res.ok) {
    const error: ZotError = Object.assign(
      new Error(res.statusText || `HTTP ${res.status}`),
      { status: res.status, body: res.body },
    )
    throw error
  }

  return JSON.parse(res.body) as T
}

export const testZotConnection = async (): Promise<{
  code: 'success' | 'error'
  msg: string
}> => {
  try {
    await zotRequest('/items', { limit: 1 })
    return { code: 'success', msg: '✅ Connection to Zotero is working' }
  } catch (error) {
    const zotError = error as ZotError
    logseq.UI.showMsg(
      `❌ logseq-zoteroloca-plugin: Connection error
Status: ${zotError.status}
Response: ${zotError.message}`,
      'error',
    )
    return {
      code: 'error',
      msg: `❌ logseq-zoteroloca-plugin: Connection error
Status: ${zotError.status}
Response: ${zotError.message}`,
    }
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
    const zotError = error as ZotError
    if (typeof zotError.status === 'number') {
      logseq.UI.showMsg(
        `❌ Connection error: ${zotError.message}
Status: ${zotError.status}
Response: ${zotError.body ?? ''}`,
        'error',
      )
    } else {
      logseq.UI.showMsg(
        `❌ An unexpected error occurred: ${zotError.message}. Check if Zotero is running.`,
        'error',
      )
    }
    return []
  }
}

export const getZotItemsFromQueryString = (queryString: string) =>
  getZotItems(queryString)

export const getZotItemsWithoutQueryString = () => getZotItems()

export const getAnnotationsByItemKey = async (
  itemKey: string,
  since?: string,
): Promise<Map<string, AnnotationItem[]>> => {
  const attachments = await zotRequest<ZotItem[]>(
    `/items/${itemKey}/children`,
    { itemType: 'attachment' },
  )

  const annotationMap = new Map<string, AnnotationItem[]>()

  for (const attachment of attachments) {
    const annotations = await zotRequest<ZotItem[]>(
      `/items/${attachment.data.key}/children`,
      { itemType: 'annotation' },
    )

    const filtered = annotations
      .filter((a) => {
        if (!since) return true
        return new Date(a.data.dateAdded) > new Date(since)
      })
      .filter((a) => a.data.annotationText)
      .map((a) => ({
        annotationText: a.data.annotationText ?? '',
        annotationComment: a.data.annotationComment ?? '',
        annotationSortIndex: a.data.annotationSortIndex ?? '',
      }))

    if (filtered.length > 0) {
      annotationMap.set(attachment.data.key, filtered)
    }
  }

  return annotationMap
}

export const getZotCollections = async (): Promise<CollectionItem[]> => {
  try {
    const allCollectionNames = await zotRequest<ZotCollection[]>('/collections')

    return allCollectionNames.map((item: ZotCollection) => ({
      key: item.data.key,
      name: item.data.name,
    }))
  } catch (error) {
    const zotError = error as ZotError
    if (typeof zotError.status === 'number') {
      logseq.UI.showMsg(
        `❌ Connection error: ${zotError.message}
Status: ${zotError.status}
Response: ${zotError.body ?? ''}`,
        'error',
      )
    } else {
      logseq.UI.showMsg(
        `❌ An unexpected error occurred: ${zotError.message}. Check if Zotero is running.`,
        'error',
      )
    }
    return []
  }
}
