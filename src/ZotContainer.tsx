import './bg.css'
import '@mantine/core/styles.css'
import 'inter-ui/inter.css'

import { createTheme, MantineProvider, MantineTheme, rgba } from '@mantine/core'
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
  const theme = createTheme({
    primaryColor: 'darkTeal',
    primaryShade: 9,
    colors: {
      darkTeal: [
        '#ecfbfd',
        '#daf4f8',
        '#b0e8f2',
        '#85dded',
        '#66d3e9',
        '#56cde6',
        '#4ccae6',
        '#3eb2cd',
        '#2f9eb7',
        '#0d89a0',
      ],
    },
    fontFamily: 'Inter',
  })

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <div style={{ background: 'none' }}>
          {
            //Deprecated for now: flag == 'table' && <Zotero />
          }
          {(flag == 'full' || flag == 'citation') && rect && uuid && (
            <SearchItem flag={flag} rect={rect} uuid={uuid} />
          )}
        </div>
      </MantineProvider>
    </QueryClientProvider>
  )
}
