import { Button, Checkbox, Group, Select, Space, Stack } from '@mantine/core'
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

import { ZotItem } from '../interfaces'

interface FormValues {
  pageSize: string
  colVisibility: any
}

export const ButtonContainer = ({
  table,
  insertAll,
}: {
  table: Table<ZotItem>
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
            />
          )}
        />
      ))}
    </>
  )

  return (
    <Stack gap="sm">
      <Group>
        <Button onClick={() => setShowColumnChooser(!showColumnChooser)}>
          {showColumnChooser ? 'Close' : 'Choose Columns'}
        </Button>
        {showColumnChooser && <ColumnVisibilityChooser />}
      </Group>

      <Space h="1rem" />

      <Group gap={2}>
        {userConfirmation && (
          <Button w="11rem" color="red" radius="sm" onClick={insertAll}>
            Are you sure?
          </Button>
        )}
        {userConfirmation && (
          <Button
            color="gray"
            radius="sm"
            onClick={() => setUserConfirmation(false)}
          >
            <Ban size="1rem" />
          </Button>
        )}
        {!userConfirmation && (
          <Button
            w="11rem"
            color="blue"
            radius="sm"
            onClick={() => setUserConfirmation(true)}
          >
            Insert {table.getRowCount().toLocaleString()} items
          </Button>
        )}
        {!userConfirmation && (
          <>
            <Button
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronFirst size="1rem" />
            </Button>
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size="1rem" />
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size="1rem" />
            </Button>
            <Button
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
                  {...field}
                  data={[
                    { value: '10', label: '10' },
                    { value: '20', label: '20' },
                    { value: '30', label: '30' },
                    { value: '50', label: '50' },
                    { value: '100', label: '100' },
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
