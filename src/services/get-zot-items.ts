import axios, { AxiosError } from 'axios'

import { COLLECTIONS_URL, ITEM_URL, ZOT_URL } from '../constants'
import { CollectionItem, ZotCollection, ZotItem } from '../interfaces'
import { mapItems } from './map-items'
import wretch from 'wretch'
import QueryAddon from 'wretch/addons/queryString'

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

export const getZotItems = async () => {
  try {
    const zotItemsResponse = await axios({
      method: 'get',
      url: ITEM_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-zotero-connector-api-version': '3.0',
        'zotero-allowed-request': 'true',
      },
      params: {
        sort: 'dateAdded',
        direction: 'desc',
      },
    })

    const allNotesResponse = await axios({
      method: 'get',
      url: ITEM_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-zotero-connector-api-version': '3.0',
        'zotero-allowed-request': 'true',
      },
      params: {
        limit: 500,
        itemType: 'note',
        sort: 'dateAdded',
        direction: 'desc',
      },
    })

    const zotDataArr = await mapItems(
      zotItemsResponse.data,
      allNotesResponse.data,
    )
    return zotDataArr
  } catch (error) {
    logseq.UI.showMsg(
      `❌ Connection error
${(error as AxiosError).message}`,
      'error',
    )
    return []
  }
}

export const getZotItemsFromQueryString = async (queryString: string) => {
  const startTime = performance.now()

  try {
    const zotParentResultsFromSearch: ZotItem[] = await api
      .url('/items/top')
      .addon(QueryAddon)
      .query({
        sort: 'dateAdded',
        direction: 'desc',
        q: queryString,
        qmode: 'everything',
      })
      .get()
      .json()

    const notesAndAttachments: ZotItem[] = await api
      .url('/items')
      .addon(QueryAddon)
      .query({
        itemType: 'note||attachment',
      })
      .get()
      .json()

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
    logseq.UI.showMsg(
      `❌ Connection error
${(error as AxiosError).message}`,
      'error',
    )
    return []
  }
}

export const getZotCollections = async (): Promise<CollectionItem[]> => {
  try {
    const response = await axios({
      method: 'get',
      url: COLLECTIONS_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-zotero-connector-api-version': '3.0',
        'zotero-allowed-request': 'true',
      },
    })
    return response.data.map((item: ZotCollection) => ({
      key: item.data.key,
      name: item.data.name,
    }))
  } catch (error) {
    logseq.UI.showMsg(
      `❌ Connection error
${(error as AxiosError).message}`,
      'error',
    )
    return []
  }
}
