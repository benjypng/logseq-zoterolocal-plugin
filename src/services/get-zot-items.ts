import axios, { AxiosError } from 'axios'

import { COLLECTIONS_URL, ITEM_URL } from '../constants'
import { CollectionItem, ZotCollection, ZotItem } from '../interfaces'
import { mapItems } from './map-items'

export const testZotConnection = async () => {
  try {
    const response = await axios.head(ITEM_URL, {
      headers: {
        'Content-Type': 'application/json',
        'x-zotero-connector-api-version': '3.0',
        'zotero-allowed-request': 'true',
      },
    })
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

export const getZotItems = async (): Promise<ZotItem[]> => {
  try {
    const response = await axios({
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
    return response.data
  } catch (error) {
    logseq.UI.showMsg(
      `❌ Connection error
${(error as AxiosError).message}`,
      'error',
    )
    return []
  }
}

export const getOneZotItem = async (queryString: string) => {
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
        limit: 500,
        sort: 'dateAdded',
        direction: 'desc',
        q: queryString,
        qmode: 'everything',
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
