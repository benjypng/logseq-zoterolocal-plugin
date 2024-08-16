import { Flex, Input, Text } from '@mantine/core'
import { useForm } from 'react-hook-form'

import { ResultCard } from '../../components/ResultCard'
import { DEBOUNCE_DELAY } from '../../constants'
import { useDebounce } from '../../hooks/use-debounce'
import { useZotItem } from '../../hooks/use-items'
import { ZotData } from '../../interfaces'

export interface FormValues {
  search: string
}

export const SearchItem = ({
  flag,
  rect: { x, y },
  uuid,
}: {
  flag: 'full' | 'table' | 'citation'
  rect: { x: number; y: number }
  uuid: string
}) => {
  const { register, watch, reset } = useForm<FormValues>({
    defaultValues: {
      search: '',
    },
  })
  const queryString = watch('search')
  const debounceSearch = useDebounce(queryString, DEBOUNCE_DELAY)

  const { data: zotDataResult } = useZotItem(debounceSearch)

  return (
    <Flex
      style={{ left: x, top: y, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}
      bg="#fff"
      direction="column"
      pos="absolute"
      w="40rem"
    >
      <Input
        id="search-field"
        w="full"
        {...register('search')}
        type="text"
        placeholder="Start searching"
        rightSectionWidth="5rem"
        rightSection={
          <>
            {zotDataResult && zotDataResult.length == 0 && (
              <Text size="0.8rem" pl="sm" pt="0.2rem">
                No results
              </Text>
            )}
            {zotDataResult && zotDataResult.length > 0 && (
              <Text size="0.8rem" pl="sm" pt="0.2rem">
                {zotDataResult.length} results
              </Text>
            )}
          </>
        }
      />
      <Flex
        direction="column"
        mah="18rem"
        style={{ flex: '0 1 auto', overflowY: 'scroll' }}
      >
        {zotDataResult &&
          zotDataResult.map((item: ZotData) => (
            <ResultCard
              key={item.key}
              flag={flag}
              uuid={uuid}
              item={item}
              reset={reset}
            />
          ))}
      </Flex>
    </Flex>
  )
}
