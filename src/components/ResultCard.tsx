import { Badge, Flex, Text, Title } from '@mantine/core'
import { useCallback } from 'react'
import { UseFormReset } from 'react-hook-form'

import { FormValues } from '../features/search-item'
import { CreatorItem, ZotData } from '../interfaces'
import { insertZotIntoGraph } from '../services/insert-zot-into-graph'
import divStyle from '../styles/Div.module.css'

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
    <Text size="sm" mr="0.2rem">
      {creator.firstName} {creator.lastName} ({creator.creatorType})
      {length - index == 1 ? '' : ','}
    </Text>
  )
}

export const ResultCard = ({ flag, uuid, item, reset }: ResultCardProps) => {
  const { title, creators, itemType, citeKey, date } = item

  const handleClick = () => {
    if (flag === 'citation') insertCitation()
    if (flag === 'full') insertZot()
  }

  const insertCitation = useCallback(async () => {
    if (!citeKey) logseq.UI.showMsg('No citation key found', 'error')
    const templateStr = (logseq.settings!.citekeyTemplate as string).replace(
      `<% citeKey %>`,
      citeKey,
    )
    await logseq.Editor.updateBlock(uuid, templateStr)
    reset()
    logseq.hideMainUI()
  }, [item])

  const insertZot = useCallback(async () => {
    await insertZotIntoGraph(item, uuid)
    reset()
    logseq.hideMainUI()
  }, [item])

  return (
    <Flex
      onClick={handleClick}
      direction="row"
      justify="space-between"
      my="0.2rem"
      className={divStyle.style}
    >
      <Flex p="lg" w="70%" direction="column">
        <Title size="md">
          {title}{' '}
          <Badge radius="sm" color="#A9A9A9" px="0.2rem">
            {itemType}
          </Badge>
        </Title>
        <Flex dir="row" wrap="wrap" mt="0.2rem">
          {creators &&
            creators.map((creator, index) => (
              <Creators
                key={index}
                index={index}
                length={creators.length}
                creator={creator}
              />
            ))}
        </Flex>
      </Flex>
      <Flex p="lg" w="25%" direction="column" align="flex-end">
        <Text size="sm">{date}</Text>
        <Badge
          radius="sm"
          size="sm"
          px="0.2rem"
          color={item.inGraph ? 'green' : 'red'}
        >
          {item.inGraph ? 'in graph' : 'not in graph'}
        </Badge>
      </Flex>
    </Flex>
  )
}
