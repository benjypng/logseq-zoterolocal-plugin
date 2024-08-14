import { useQuery } from 'react-query'

import { ZotItem } from '../interfaces'
import { getOneZotItem, getZotItems } from '../services/get-zot-items'

export const useZotItems = () => {
  return useQuery<ZotItem[], Error>('zotItems', getZotItems, {
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error: Error) => {
      console.error('Error fetching Zotero items:', error)
    },
  })
}

export const useZotItem = (queryString: string, options = {}) => {
  return useQuery<ZotItem[], Error>(
    ['zotItem', queryString],
    () => getOneZotItem(queryString),
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
