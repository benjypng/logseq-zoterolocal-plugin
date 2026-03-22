import {
  CardHeader,
  Input,
  Popover,
  ScrollArea,
  Text,
} from '@benjypng/ls-plugin-design-system'
import { useForm } from 'react-hook-form'

import { DEBOUNCE_DELAY } from '../constants'
import { useDebounce } from '../hooks/use-debounce'
import { useZotItem } from '../hooks/use-items'
import { ZotData } from '../interfaces'
import { ResultCard } from '.'

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
    <Popover x={x} y={y} width="40rem">
      <CardHeader>
        <Input
          id="search-field"
          {...register('search')}
          type="text"
          placeholder="Start searching"
          variant="flush"
        />
        <Text as="span" size="xs" color="secondary">
          {zotDataResult?.length === 0 || !zotDataResult
            ? 'No results'
            : `${zotDataResult?.length} results`}
        </Text>
      </CardHeader>
      <ScrollArea maxHeight="18rem">
        {zotDataResult?.map((item: ZotData) => (
          <ResultCard
            key={item.key}
            flag={flag}
            uuid={uuid}
            item={item}
            reset={reset}
          />
        ))}
      </ScrollArea>
    </Popover>
  )
}
