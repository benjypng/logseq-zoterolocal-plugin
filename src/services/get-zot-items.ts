import axios, { AxiosError } from 'axios'

import { COLLECTIONS_URL, ITEM_URL } from '../constants'
import {
  CollectionItem,
  ZotCollection,
  ZotItem,
} from '../features/main/interfaces'

export const testZotConnection = async () => {
  try {
    const response = await axios.head(ITEM_URL, {
      headers: {
        'Content-Type': 'text/plain',
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

export const getZotItems = async (): Promise<ZotItem[] | void> => {
  try {
    const response = await axios({
      method: 'get',
      url: ITEM_URL,
      headers: {
        'Content-Type': 'text/plain',
        'x-zotero-connector-api-version': '3.0',
        'zotero-allowed-request': 'true',
      },
    })
    return response.data
  } catch (error) {
    logseq.UI.showMsg(
      `❌ Connection error
${(error as AxiosError).message}`,
      'error',
    )
    throw new Error((error as AxiosError).message)
  }
}

export const getZotCollections = async (): Promise<ZotCollection[] | void> => {
  try {
    const response = await axios({
      method: 'get',
      url: COLLECTIONS_URL,
      headers: {
        'Content-Type': 'text/plain',
        'x-zotero-connector-api-version': '3.0',
        'zotero-allowed-request': 'true',
      },
    })
    return response.data
  } catch (error) {
    logseq.UI.showMsg(
      `❌ Connection error
${(error as AxiosError).message}`,
      'error',
    )
    throw new Error((error as AxiosError).message)
  }
}
