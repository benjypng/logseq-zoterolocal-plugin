import { useQuery } from 'react-query'

import { ZotData } from '../interfaces'
import {
  getZotItemsFromQueryString,
  getZotItemsWithoutQueryString,
} from '../services/get-zot-items'

export const useZotItems = () => {
  return useQuery<ZotData[], Error>('zotItems', getZotItemsWithoutQueryString, {
    retry: false,
    refetchOnWindowFocus: false,
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
      refetchOnWindowFocus: false,
      onError: (error: Error) => {
        console.error('Error fetching Zotero items:', error)
      },
      enabled: !!queryString && queryString.length > 3,
      ...options,
    },
  )
}
