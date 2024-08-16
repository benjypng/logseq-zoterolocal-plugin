import { Container, Table } from '@mantine/core'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpAZ, ArrowUpZA } from 'lucide-react'
import { memo, useMemo, useState } from 'react'

import { ZotData } from '../interfaces'
import { insertZotIntoGraph } from '../services/insert-zot-into-graph'
import tdStyle from '../styles/Td.module.css'
import { ButtonContainer } from './ButtonContainer'
import { Columns } from './create-columns'

interface TableProps {
  data: ZotData[]
}

export const DataTable = memo(({ data }: TableProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(logseq.settings!.columnVisibility as Record<string, boolean>)

  const columns = useMemo(() => Columns, [data])

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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  })

  // Save column visibility to settings for persistence
  logseq.updateSettings({ columnVisibility })

  const insertAll = async () => {
    // Get todays page to insert references to
    const { preferredDateFormat } = await logseq.App.getUserConfigs()
    const todayDate = format(new Date(), preferredDateFormat)
    const page = await logseq.Editor.getPage(todayDate)
    if (!page) {
      logseq.UI.showMsg(
        'Error getting todays date. No Zotero items have been inserted',
        'error',
      )
      return
    }

    try {
      await Promise.all(
        data.map((item) => insertZotIntoGraph(item, page.name, 'page')),
      )
    } catch (error) {
      logseq.UI.showMsg(
        'Error inserting items. You may wish to go to your file explorer to check which ZotItems have been inserted',
      )
      console.error(error)
    }
  }

  return (
    <Container m={0} p={0} w="100%" style={{ overflowX: 'scroll' }}>
      <ButtonContainer table={table} insertAll={insertAll} />
      <Table mah="50rem" style={{ fontSize: '0.8rem' }}>
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {{
                    asc: (
                      <ArrowUpAZ
                        size="1rem"
                        style={{ marginLeft: '0.2rem' }}
                        color="#333"
                      />
                    ),
                    desc: (
                      <ArrowUpZA
                        size="1rem"
                        style={{ marginLeft: '0.2rem' }}
                        color="#333"
                      />
                    ),
                  }[header.column.getIsSorted() as string] ?? null}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id} maw="12rem" className={tdStyle.td}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  )
})
