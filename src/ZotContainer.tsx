import { QueryClient, QueryClientProvider } from 'react-query'

import Zotero from './features/items-table'

const queryClient = new QueryClient()

export const ZotContainer = ({ uuid }: { uuid: string }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Zotero uuid={uuid} />
    </QueryClientProvider>
  )
}
