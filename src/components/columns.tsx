import { ColumnDef } from '@tanstack/react-table'

import { ZotData } from '../features/main/interfaces'

const addToGraph = (pageName: string) => {
  return (
    <button
      onClick={() => {
        //TODO: Add other create graph stuff
        logseq.App.pushState('page', {
          name: pageName,
        })
        logseq.hideMainUI()
      }}
    >
      Insert
    </button>
  )
}

export const columns: ColumnDef<ZotData>[] = [
  {
    header: 'In Graph?',
    accessorKey: 'inGraph',
    cell: ({ getValue, row }) => {
      const pageName = logseq.settings!.useCiteKeyForTitle
        ? row.original.citeKey
        : row.original.title
      return (
        <div>
          {getValue<ZotData['inGraph']>() ? '✅' : addToGraph(pageName)}
        </div>
      )
    },
  },
  {
    header: 'Key',
    accessorKey: 'key',
  },
  {
    header: 'Citation Key',
    accessorKey: 'citeKey',
  },
  {
    header: 'Version',
    accessorKey: 'version',
  },
  {
    header: 'Item Type',
    accessorKey: 'itemType',
  },
  {
    header: 'Title',
    accessorKey: 'title',
  },
  {
    header: 'Date',
    accessorKey: 'date',
  },
  {
    header: 'Language',
    accessorKey: 'language',
  },
  {
    header: 'Short Title',
    accessorKey: 'shortTitle',
  },
  {
    header: 'Library Catalog',
    accessorKey: 'libraryCatalog',
  },
  {
    header: 'URL',
    accessorKey: 'url',
  },
  {
    header: 'Access Date',
    accessorKey: 'accessDate',
  },
  {
    header: 'Creators',
    accessorKey: 'creators',
    cell: ({ getValue }) => (
      <div>
        {getValue<ZotData['creators']>().map((creator, index) => (
          <div key={index}>
            {creator.firstName} {creator.lastName} ({creator.creatorType}),{' '}
          </div>
        ))}
      </div>
    ),
  },
  {
    header: 'Date Added',
    accessorKey: 'dateAdded',
  },
  {
    header: 'Date Modified',
    accessorKey: 'dateModified',
  },
]
