import { Container, Group, Loader, Space, Text, Title } from '@mantine/core'
import { ShieldAlert, SquareX } from 'lucide-react'
import { useCallback } from 'react'

import { DataTable } from '../../components/DataTable'
import { useZotItems } from '../../hooks/use-items'

export const ItemsTable = () => {
  const { data: zotItems, isSuccess, error, isLoading } = useZotItems()

  const handleClose = useCallback(() => {
    logseq.hideMainUI()
  }, [zotItems])

  return (
    <Container
      py="md"
      mt="xl"
      bg="white"
      style={{ border: '0.1rem solid #ccc' }}
    >
      <Group justify="space-between">
        <Title size="2rem">logseq-zoterolocal-plugin</Title>
        <SquareX onClick={handleClose} id="zot-close-button" />
      </Group>
      <Space h="1rem" />
      <>
        {isLoading && (
          <Group className="zot-loading-error" gap="1rem">
            <Loader type="bars" size={20} />
            <Text size="sm">
              Fetching data from Zotero 7... <br />
              It may take up to 5 seconds for larger libraries.
            </Text>
          </Group>
        )}
        {error && (
          <Group className="zot-loading-error">
            <ShieldAlert size="2rem" /> Error loading items
          </Group>
        )}
        <Space />
        {isSuccess && zotItems && <DataTable data={zotItems} />}
      </>
    </Container>
  )
}
