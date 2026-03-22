import { Badge, HStack, Text, VStack } from '@benjypng/ls-plugin-design-system'
import { useCallback } from 'react'
import { UseFormReset } from 'react-hook-form'

import { FormValues } from './SearchItem'
import { CreatorItem, ZotData } from '../interfaces'
import { insertZotIntoGraph } from '../services/insert-zot-into-graph'

interface ResultCardProps {
  flag: 'full' | 'table' | 'citation'
  uuid: string
  item: ZotData
  reset: UseFormReset<FormValues>
}

const Creators = ({
  index,
  length,
  creator,
}: {
  index: number
  length: number
  creator: CreatorItem
}) => {
  return (
    <Text as="span" size="sm" color="secondary">
      {creator.firstName} {creator.lastName} ({creator.creatorType})
      {length - index === 1 ? '' : ','}
    </Text>
  )
}

export const ResultCard = ({ flag, uuid, item, reset }: ResultCardProps) => {
  const { title, creators, itemType, citeKey, date } = item

  const insertCitation = useCallback(async () => {
    if (!citeKey || citeKey === 'N/A') {
      logseq.UI.showMsg(
        'Citation key not configured properly in Better BibTex',
        'error',
      )
      return
    }
    const templateStr = (logseq.settings!.citekeyTemplate as string).replace(
      `<% citeKey %>`,
      citeKey,
    )
    await logseq.Editor.insertAtEditingCursor(templateStr)

    reset()
    logseq.hideMainUI()
  }, [item])

  const insertZot = useCallback(async () => {
    const pageName = await insertZotIntoGraph(item)
    reset()
    if (!pageName) return

    await logseq.Editor.updateBlock(uuid, `[[${pageName}]]`)
  }, [item])

  const handleClick = () => {
    if (flag === 'citation') insertCitation()
    if (flag === 'full') insertZot()
  }

  return (
    <HStack
      justify="between"
      onClick={handleClick}
      style={{ padding: '0.6rem 0.85rem', cursor: 'pointer' }}
    >
      <VStack spacing="xs" style={{ width: '70%' }}>
        <HStack align="baseline" wrap>
          <Text as="span" weight="semibold">
            {title}
          </Text>
          <Badge>{itemType}</Badge>
        </HStack>
        <HStack wrap spacing="xs">
          {creators &&
            creators.map((creator, index) => (
              <Creators
                key={index}
                index={index}
                length={creators.length}
                creator={creator}
              />
            ))}
        </HStack>
        {citeKey && (
          <Text as="span" size="xs" color="tertiary">
            Cite Key: {citeKey}
          </Text>
        )}
      </VStack>
      <VStack align="end" spacing="xs" style={{ width: '25%' }}>
        <Text as="span" size="sm" color="secondary">
          {date}
        </Text>
        <Badge variant={item.inGraph ? 'success' : 'error'}>
          {item.inGraph ? 'in graph' : 'not in graph'}
        </Badge>
      </VStack>
    </HStack>
  )
}
