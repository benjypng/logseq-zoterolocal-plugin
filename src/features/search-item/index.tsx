import './index.css'

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
  const { register, watch, reset } = useForm<FormValues>()
  const queryString = watch('search')
  const debounceSearch = useDebounce(queryString, DEBOUNCE_DELAY)

  const { data: zotDataResult } = useZotItem(debounceSearch)

  return (
    <div id="zot-search-container" style={{ left: x, top: y }}>
      <div id="zot-input">
        <input
          id="search-field"
          {...register('search')}
          type="text"
          placeholder="Start searching"
        />
      </div>
      <div id="zot-results">
        {zotDataResult && zotDataResult.length == 0 && (
          <div className="results-length">No results</div>
        )}
        {zotDataResult && zotDataResult.length > 0 && (
          <div className="results-length">{zotDataResult.length} results</div>
        )}
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
      </div>
    </div>
  )
}
