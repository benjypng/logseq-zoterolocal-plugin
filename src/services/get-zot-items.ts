import wretch from 'wretch'
import QueryAddon from 'wretch/addons/queryString'
import { WretchError } from 'wretch/resolver'

import { BASE_QUERY, ZOT_URL } from '../constants'
import { CollectionItem, ZotCollection, ZotItem } from '../interfaces'
import { mapItems } from './map-items'

const api = wretch().url(ZOT_URL).headers({
  'Content-Type': 'application/json',
  'x-zotero-connector-api-version': '3.0',
  'zotero-allowed-request': 'true',
})

export const testZotConnection = async (): Promise<{
  code: 'success' | 'error'
  msg: string
}> => {
  try {
    await api.url('/items').addon(QueryAddon).query({ limit: 1 }).get().res()
    return { code: 'success', msg: '✅ Connection to Zotero is working' }
  } catch (error) {
    // If error.status is undefined, it means Zotero is not open

    const wretchError = error as WretchError
    logseq.UI.showMsg(
      `❌ Connection error
Status: ${wretchError.status}
Response: ${wretchError.message}`,
      'error',
    )
    return {
      code: 'error',
      msg: `❌ Connection error
Status: ${wretchError.status}
Response: ${wretchError.message}`,
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
        api
          .url('/items/top')
          .addon(QueryAddon)
          .query(searchQuery)
          .get()
          .json<ZotItem[]>(),
        api
          .url('/items')
          .addon(QueryAddon)
          .query({
            itemType: 'note||attachment',
          })
          .get()
          .json<ZotItem[]>(),
      ],
    )

    const zotDataArr = await mapItems(
      zotParentResultsFromSearch,
      notesAndAttachments,
    )

    const endTime = performance.now()
    console.log(
      'logseq-zoterolocal-plugin: Time taken for query: ',
      endTime - startTime,
      'ms',
    )

    return zotDataArr
  } catch (error) {
    if (error instanceof WretchError) {
      logseq.UI.showMsg(
        `❌ Connection error: ${error.message}
Status: ${error.status}
Response: ${await error.response.text()}`,
        'error',
      )
    } else {
      logseq.UI.showMsg(
        `❌ An unexpected error occurred: ${(error as Error).message}`,
        'error',
      )
    }
    return []
  }
}

export const getZotItemsFromQueryString = (queryString: string) =>
  getZotItems(queryString)

export const getZotItemsWithoutQueryString = () => getZotItems()

export const getZotCollections = async (): Promise<CollectionItem[]> => {
  try {
    const allCollectionNames: ZotCollection[] = await api
      .url('/collections')
      .get()
      .json()

    return allCollectionNames.map((item: ZotCollection) => ({
      key: item.data.key,
      name: item.data.name,
    }))
  } catch (error) {
    if (error instanceof WretchError) {
      logseq.UI.showMsg(
        `❌ Connection error: ${error.message}
Status: ${error.status}
Response: ${await error.response.text()}`,
        'error',
      )
    } else {
      logseq.UI.showMsg(
        `❌ An unexpected error occurred: ${(error as Error).message}`,
        'error',
      )
    }
    return []
  }
}
