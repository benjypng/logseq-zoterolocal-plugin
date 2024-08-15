import { ColumnDef } from '@tanstack/react-table'
import { memo } from 'react'

import { CreatorItem, ZotItem } from '../../interfaces'

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

export const columns: ColumnDef<ZotItem>[] = [
  {
    header: 'Title',
    accessorFn: (row) => row.data.title || 'N/A',
  },
  {
    header: 'Cite Key',
    id: 'citeKey',
    accessorFn: (row) => getCiteKey(row.data.extra) ?? 'N/A',
  },
  {
    header: 'Creators',
    accessorFn: (row) => row.data.creators || [],
    cell: ({ getValue }) =>
      getValue() ? <CreatorsCell value={getValue() as CreatorItem[]} /> : 'N/A',
  },
  {
    header: 'Item Type',
    accessorFn: (row) => row.data.itemType || 'N/A',
  },
  {
    header: 'Key',
    accessorFn: (row) => row.data.key || 'N/A',
  },
  {
    header: 'Short Title',
    accessorFn: (row) => row.data.shortTitle || 'N/A',
  },
  {
    header: 'Access Date',
    accessorFn: (row) => row.data.accessDate || 'N/A',
  },
  {
    header: 'Date Added',
    accessorFn: (row) => row.data.dateAdded || 'N/A',
  },
  {
    header: 'Date Modified',
    accessorFn: (row) => row.data.dateModified || 'N/A',
  },
  {
    header: 'Date',
    accessorFn: (row) => row.data.date || 'N/A',
  },
  {
    header: 'Language',
    accessorFn: (row) => row.data.language || 'N/A',
  },
  {
    header: 'Library Catalog',
    accessorFn: (row) => row.data.libraryCatalog || 'N/A',
  },
  {
    header: 'URL',
    accessorFn: (row) => row.data.url || 'N/A',
  },
  {
    header: 'Version',
    accessorFn: (row) => row.version.toString(),
  },
]
