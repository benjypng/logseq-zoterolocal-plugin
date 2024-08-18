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

export const testZotConnection = async () => {
  try {
    const response = await api.url('/items').head().res()
    return {
      message: '✅ Connection to Zotero is working',
      code: response.status,
    }
  } catch (error) {
    return {
      data: error,
      message:
        '❌ Unable to retrieve items from Zotero. Please ensure that you are using Zotero 7 (and above), and that the app is running.',
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
