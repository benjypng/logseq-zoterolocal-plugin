import { useQuery } from 'react-query'

import { ZotData } from '../interfaces'
import {
  getZotItems,
  getZotItemsFromQueryString,
} from '../services/get-zot-items'

export const useZotItems = () => {
  return useQuery<ZotData[], Error>('zotItems', getZotItems, {
    retry: false,
    onError: (error: Error) => {
      console.error('Error fetching Zotero items:', error)
    },
  })
}

export const useZotItem = (queryString: string, options = {}) => {
  return useQuery<ZotData[], Error>(
    ['zotItem', queryString],
    () => getZotItemsFromQueryString(queryString),
    {
      retry: false,
      onError: (error: Error) => {
        console.error('Error fetching Zotero items:', error)
      },
      enabled: !!queryString && queryString.length > 3,
      ...options,
    },
  )
}
