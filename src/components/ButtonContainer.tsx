import { Table } from '@tanstack/react-table'
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

import { ZotData } from '../features/main/interfaces'

export const ButtonContainer = ({ table }: { table: Table<ZotData> }) => {
  const [showColumnChooser, setShowColumnChooser] = useState(false)

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
    <div className="zot-button-container">
      <button
        className="column-chooser-button"
        onClick={() => setShowColumnChooser(!showColumnChooser)}
      >
        Choose Columns
      </button>
      {showColumnChooser && <ColumnVisibilityChooser />}
      <button
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronFirst size="1rem" />
      </button>
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft size="1rem" />
      </button>
      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight size="1rem" />
      </button>
      <button
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronLast size="1rem" />
      </button>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
    </div>
  )
}
