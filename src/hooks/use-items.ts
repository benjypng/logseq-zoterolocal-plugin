import { useQuery } from 'react-query'

import { ZotData } from '../features/main/interfaces'
import { getZotItems } from '../services/get-zot-items'

export const useZotItems = () => {
  return useQuery<ZotData[], Error>('zotItems', getZotItems, {
    retry: false,
    refetchOnWindowFocus: false,
    onError: (error: Error) => {
      console.error('Error fetching Zotero items:', error)
    },
  })
}
