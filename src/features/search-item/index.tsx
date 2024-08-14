import { useForm } from 'react-hook-form'

import { ResultCard } from '../../components/ResultCard'
import { DEBOUNCE_DELAY } from '../../constants'
import { useDebounce } from '../../hooks/use-debounce'
import { useZotItem } from '../../hooks/use-items'
import { ZotItem } from '../../interfaces'

export const SearchItem = () => {
  const { register, watch } = useForm()
  const queryString = watch('search')
  const debounceSearch = useDebounce(queryString, DEBOUNCE_DELAY)

  const { data: zotResult } = useZotItem(debounceSearch)

  return (
    <div id="zot-search-container">
      <div id="zot-input">
        <input
          id="search-field"
          {...register('search')}
          type="text"
          placeholder="Start searching"
        />
      </div>
      <div id="zot-results">
        {zotResult && zotResult.length == 0 && <div>No results</div>}
        {zotResult &&
          zotResult.map((item: ZotItem) => (
            <ResultCard key={item.key} item={item.data} />
          ))}
      </div>
    </div>
  )
}
