import './base.css'

import { QueryClient, QueryClientProvider } from 'react-query'

import Zotero from './features/items-table'
import { SearchItem } from './features/search-item'

const queryClient = new QueryClient()

export const ZotContainer = ({
  flag,
  uuid,
  rect,
}: {
  flag: 'search' | 'table'
  uuid?: string
  rect?: { x: number; y: number }
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {flag == 'table' && <Zotero />}
      {flag == 'search' && rect && uuid && (
        <SearchItem rect={rect} uuid={uuid} />
      )}
    </QueryClientProvider>
  )
}
