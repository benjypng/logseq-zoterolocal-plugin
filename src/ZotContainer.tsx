import { QueryClient, QueryClientProvider } from 'react-query'

import { SearchItem } from './features/search-item'

const queryClient = new QueryClient()

export const ZotContainer = ({
  flag,
  uuid,
  rect,
}: {
  flag: 'full' | 'table' | 'citation'
  uuid?: string
  rect?: { x: number; y: number }
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {
        //Deprecated for now: flag == 'table' && <Zotero />
      }
      {(flag == 'full' || flag == 'citation') && rect && uuid && (
        <SearchItem flag={flag} rect={rect} uuid={uuid} />
      )}
    </QueryClientProvider>
  )
}
