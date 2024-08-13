import { ColumnDef } from '@tanstack/react-table'
import { memo } from 'react'

import { ZotData } from '../features/main/interfaces'

const CreatorsCell = memo(({ value }: { value: ZotData['creators'] }) => (
  <div>
    {value?.map((creator, index) => (
      <div key={index}>
        {creator.firstName} {creator.lastName} ({creator.creatorType}),{' '}
      </div>
    ))}
  </div>
))

export const createColumns = (
  handleInsert: (row: ZotData) => void,
): ColumnDef<ZotData>[] => [
  {
    header: 'In Graph?',
    accessorKey: 'inGraph',
    cell: ({ getValue, row }) => (
      <div>
        {getValue<ZotData['inGraph']>() ? (
          '✅'
        ) : (
          <button onClick={() => handleInsert(row.original)}>Insert</button>
        )}
      </div>
    ),
  },
  {
    header: 'Title',
    accessorKey: 'title',
  },
  {
    header: 'Creators',
    accessorKey: 'creators',
    cell: ({ getValue }) => (
      <CreatorsCell value={getValue<ZotData['creators']>()} />
    ),
  },
  {
    header: 'Citation Key',
    accessorKey: 'citeKey',
  },
  {
    header: 'Item Type',
    accessorKey: 'itemType',
  },
  {
    header: 'Key',
    accessorKey: 'key',
  },
  {
    header: 'Short Title',
    accessorKey: 'shortTitle',
  },
  {
    header: 'Access Date',
    accessorKey: 'accessDate',
  },
  {
    header: 'Date Added',
    accessorKey: 'dateAdded',
  },
  {
    header: 'Date Modified',
    accessorKey: 'dateModified',
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
    header: 'Library Catalog',
    accessorKey: 'libraryCatalog',
  },
  {
    header: 'URL',
    accessorKey: 'url',
  },
  {
    header: 'Version',
    accessorKey: 'version',
  },
]
