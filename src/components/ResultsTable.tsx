import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'

import { ZotData } from '../features/main/interfaces'

interface TableProps {
  data: ZotData[]
}

export const ResultsTable = ({ data }: TableProps) => {
  const [sorting, setSorting] = useState<any[]>([])
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({})
  const [showColumnChooser, setShowColumnChooser] = useState(false)

  const columns = useMemo<ColumnDef<ZotData>[]>(
    () => [
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
    ],
    [],
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    onColumnVisibilityChange: setColumnVisibility,
  })

  const ColumnVisibilityChooser = () => (
    <div className="column-chooser">
      {table.getAllLeafColumns().map((column) => (
        <div key={column.id}>
          <label>
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            {column.id}
          </label>
        </div>
      ))}
    </div>
  )

  return (
    <div className="zot-table-container">
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <button
          className="column-chooser-button"
          onClick={() => setShowColumnChooser(!showColumnChooser)}
        >
          Choose Columns
        </button>
        {showColumnChooser && <ColumnVisibilityChooser />}
      </div>
      <table className="zot-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
