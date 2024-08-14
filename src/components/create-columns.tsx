import { ColumnDef } from '@tanstack/react-table'
import { memo } from 'react'

import { ZotData, ZotItem } from '../features/main/interfaces'

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
  handleInsert: (row: ZotItem) => void,
): ColumnDef<ZotItem>[] => [
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
    accessorKey: 'data.title',
  },
  {
    header: 'Creators',
    accessorKey: 'data.creators',
    cell: ({ getValue }) => (
      <CreatorsCell value={getValue<ZotData['creators']>()} />
    ),
  },
  {
    header: 'Citation Key',
    accessorKey: 'data.citeKey',
  },
  {
    header: 'Item Type',
    accessorKey: 'data.itemType',
  },
  {
    header: 'Key',
    accessorKey: 'data.key',
  },
  {
    header: 'Short Title',
    accessorKey: 'data.shortTitle',
  },
  {
    header: 'Access Date',
    accessorKey: 'data.accessDate',
  },
  {
    header: 'Date Added',
    accessorKey: 'data.dateAdded',
  },
  {
    header: 'Date Modified',
    accessorKey: 'data.dateModified',
  },
  {
    header: 'Date',
    accessorKey: 'data.date',
  },
  {
    header: 'Language',
    accessorKey: 'data.language',
  },
  {
    header: 'Library Catalog',
    accessorKey: 'data.libraryCatalog',
  },
  {
    header: 'URL',
    accessorKey: 'data.url',
  },
  {
    header: 'Version',
    accessorKey: 'data.version',
  },
]
