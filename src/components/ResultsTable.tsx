import './table.css'

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

import { ZotData } from '../features/main/interfaces'
import { columns } from './columns'

interface TableProps {
  data: ZotData[]
}

export const ResultsTable = ({ data }: TableProps) => {
  const [sorting, setSorting] = useState<any[]>([])
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(logseq.settings!.columnVisibility as Record<string, boolean>)
  const [showColumnChooser, setShowColumnChooser] = useState(false)

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

  logseq.updateSettings({ columnVisibility })

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
