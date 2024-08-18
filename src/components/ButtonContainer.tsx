import { Button, Checkbox, Group, Select, Stack, Tooltip } from '@mantine/core'
import { Table } from '@tanstack/react-table'
import {
  Ban,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { ZotData } from '../interfaces'

interface FormValues {
  pageSize: string
  colVisibility: any
}

export const ButtonContainer = ({
  table,
  insertAll,
}: {
  table: Table<ZotData>
  insertAll: () => void
}) => {
  const { control, watch } = useForm<FormValues>({
    defaultValues: {
      pageSize: table.getState().pagination.pageSize.toString(),
      colVisibility: table.getState().columnVisibility,
    },
  })
  const [showColumnChooser, setShowColumnChooser] = useState(false)
  const [userConfirmation, setUserConfirmation] = useState(false)
  const pageSize = watch('pageSize')

  useEffect(() => {
    table.setPageSize(Number(pageSize))
  }, [pageSize])

  const ColumnVisibilityChooser = () => (
    <>
      {table.getAllLeafColumns().map((column) => (
        <Controller
          key={column.id}
          control={control}
          name={`colVisibility.${column.id}`}
          render={({ field }) => (
            <Checkbox
              {...field}
              label={column.id}
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
              size="xs"
            />
          )}
        />
      ))}
    </>
  )

  return (
    <Stack gap="sm">
      <Group>
        <Button
          size="xs"
          onClick={() => setShowColumnChooser(!showColumnChooser)}
        >
          {showColumnChooser ? 'Close' : 'Choose Columns'}
        </Button>
        {showColumnChooser && <ColumnVisibilityChooser />}
      </Group>

      <Group gap={2}>
        {userConfirmation && (
          <Button
            size="xs"
            w="11rem"
            color="red"
            radius="sm"
            onClick={insertAll}
          >
            Click to Proceed (re-index is recommended after completion)
          </Button>
        )}
        {userConfirmation && (
          <Button
            size="xs"
            color="gray"
            radius="sm"
            onClick={() => setUserConfirmation(false)}
          >
            <Ban size="1rem" />
          </Button>
        )}
        {!userConfirmation && (
          <Tooltip
            label={'There may be an issue inserting more than 100 items'}
          >
            <Button
              size="xs"
              w="11rem"
              color="blue"
              radius="sm"
              disabled={table.getRowCount() > 100 ? true : false}
              onClick={() => setUserConfirmation(true)}
            >
              Insert {table.getRowCount().toLocaleString()} items
            </Button>
          </Tooltip>
        )}
        {!userConfirmation && (
          <>
            <Button
              size="xs"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronFirst size="1rem" />
            </Button>
            <Button
              size="xs"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size="1rem" />
            </Button>
            <Button
              size="xs"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size="1rem" />
            </Button>
            <Button
              size="xs"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronLast size="1rem" />
            </Button>

            <Controller
              control={control}
              name="pageSize"
              render={({ field }) => (
                <Select
                  size="xs"
                  {...field}
                  data={[
                    { value: '10', label: '10 results' },
                    { value: '20', label: '20 results' },
                    { value: '30', label: '30 results' },
                    { value: '50', label: '50 results' },
                    { value: '100', label: '100 results' },
                  ]}
                />
              )}
            />
          </>
        )}
      </Group>
    </Stack>
  )
}
