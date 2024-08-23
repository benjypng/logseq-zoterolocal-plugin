import { ColumnDef } from '@tanstack/react-table'
import { memo } from 'react'

import { CreatorItem, ZotData } from '../../interfaces'

export const getCiteKey = (extra: string | undefined) => {
  if (!extra) return
  const citeKey = /Citation Key: ([^\s\n]+)/.exec(extra)
  if (citeKey && citeKey[1]) return citeKey[1]
}

export const CreatorsCell = memo(({ value }: { value: CreatorItem[] }) => {
  if (value.length == 0) return 'N/A'
  return value
    .map(
      (creator) =>
        `${creator.firstName} ${creator.lastName} (${creator.creatorType})`,
    )
    .join(', ')
})

export const columns: ColumnDef<ZotData>[] = [
  {
    header: 'Title',
    accessorFn: (row) => row.title || 'N/A',
  },
  {
    header: 'Cite Key',
    id: 'citeKey',
    accessorFn: (row) => getCiteKey(row.extra) ?? 'N/A',
  },
  {
    header: 'Creators',
    accessorFn: (row) => row.creators || [],
    cell: ({ getValue }) =>
      getValue() ? <CreatorsCell value={getValue() as CreatorItem[]} /> : 'N/A',
  },
  {
    header: 'Item Type',
    accessorFn: (row) => row.itemType || 'N/A',
  },
  {
    header: 'Key',
    accessorFn: (row) => row.key || 'N/A',
  },
  {
    header: 'Short Title',
    accessorFn: (row) => row.shortTitle || 'N/A',
  },
  {
    header: 'Access Date',
    accessorFn: (row) => row.accessDate || 'N/A',
  },
  {
    header: 'Date Added',
    accessorFn: (row) => row.dateAdded || 'N/A',
  },
  {
    header: 'Date Modified',
    accessorFn: (row) => row.dateModified || 'N/A',
  },
  {
    header: 'Date',
    accessorFn: (row) => row.date || 'N/A',
  },
  {
    header: 'Language',
    accessorFn: (row) => row.language || 'N/A',
  },
  {
    header: 'Library Catalog',
    accessorFn: (row) => row.libraryCatalog || 'N/A',
  },
  {
    header: 'URL',
    accessorFn: (row) => row.url || 'N/A',
  },
  {
    header: 'Version',
    accessorFn: (row) => row.version.toString(),
  },
]
