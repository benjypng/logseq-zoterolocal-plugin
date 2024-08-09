import { ColumnDef } from '@tanstack/react-table'

import { ZotData } from '../features/main/interfaces'

export const columns: ColumnDef<ZotData>[] = [
  {
    header: 'Key',
    accessorKey: 'key',
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
            {creator.firstName} {creator.lastName} ({creator.creatorType})
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
