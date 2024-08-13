import { QueryClient, QueryClientProvider } from 'react-query'

import Zotero from './features/main'

const queryClient = new QueryClient()

const ZotContainer = ({ uuid }: { uuid: string }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Zotero uuid={uuid} />
    </QueryClientProvider>
  )
}

export default ZotContainer
