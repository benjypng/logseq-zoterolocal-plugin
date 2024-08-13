import { useQuery } from 'react-query'

import { ZotItem } from '../features/main/interfaces'
import { getZotItems } from '../services/get-zot-items'

export const useZotItems = () => {
  return useQuery<ZotItem[], Error>('zotItems', getZotItems, {
    retry: false,
    onError: (error: Error) => {
      console.error('Error fetching Zotero items:', error)
    },
  })
}
