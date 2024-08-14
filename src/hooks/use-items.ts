import { useQuery } from 'react-query'

import { ZotData, ZotItem } from '../features/main/interfaces'
import { getZotItems } from '../services/get-zot-items'

export const useZotItems = () => {
  return useQuery<ZotItem[], Error>('zotItems', getZotItems, {
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error: Error) => {
      console.error('Error fetching Zotero items:', error)
    },
  })
}
