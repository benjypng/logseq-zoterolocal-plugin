import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React, { useState } from 'react'

export const ResultsTable = ({ data }) => {
  const [sorting, setSorting] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [showColumnChooser, setShowColumnChooser] = useState(false)

  const columns = React.useMemo(
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
        cell: ({ getValue }: { getValue: any }) => (
          <div>
            {getValue().map((creator: any, index: any) => (
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
    <div
      style={{
        position: 'absolute',
        background: 'white',
        border: '1px solid black',
        padding: '10px',
        zIndex: 1000,
      }}
    >
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
    <div>
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <button onClick={() => setShowColumnChooser(!showColumnChooser)}>
          Choose Columns
        </button>
        {showColumnChooser && <ColumnVisibilityChooser />}
      </div>
      <table id="zot-table">
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
                  }[header.column.getIsSorted()] ?? null}
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
