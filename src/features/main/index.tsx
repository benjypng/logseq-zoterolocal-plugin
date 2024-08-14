import './index.css'

import { ShieldAlert, SquareX } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ResultsTable } from '../../components/ResultsTable'
import { useDebounce } from '../../hooks/use-debounce'
import { useFuse } from '../../hooks/use-fuse'
import { useZotItems } from '../../hooks/use-items'
import { ZotData, ZotItem } from './interfaces'

interface ZoteroProps {
  uuid: string
}

const Zotero = ({ uuid }: ZoteroProps) => {
  const { data, isLoading, isSuccess, error } = useZotItems()
  const [searchResults, setSearchResults] = useState<ZotItem[]>([])
  const { register, watch, reset } = useForm()

  useEffect(() => {
    if (data) {
      const updateLocalItems = async () => {
        setSearchResults(data)
      }
      updateLocalItems()
    }
  }, [data])

  const searchInput = watch('search')
  const debounceSearch = useDebounce(searchInput, 300)

  useEffect(() => {
    if (!debounceSearch) return // Returns all items by default
    if (data) {
      const results = useFuse(data, debounceSearch)
      setSearchResults(results.map((result) => result.item))
    }
  }, [debounceSearch, data])

  const handleClose = useCallback(() => {
    logseq.hideMainUI()
  }, [data])

  return (
    <div id="zot-container">
      <div id="zot-header-container">
        <h1>logseq-zoterolocal-plugin</h1>
        <SquareX onClick={handleClose} id="zot-close-button" />
      </div>
      {isLoading && (
        <div className="zot-loading-error">
          <LoadingSpinner size="2rem" color="teal" /> Loading...
        </div>
      )}
      {error && (
        <div className="zot-loading-error">
          <ShieldAlert size="2rem" color="teal" /> Error loading items:{' '}
          {error.message}
        </div>
      )}
      {isSuccess && (
        <>
          <div id="zot-input-container">
            <input
              autoFocus
              {...register('search')}
              type="text"
              placeholder="Start searching"
            />
            {searchResults && <p>Results: {searchResults.length}</p>}
          </div>

          <div id="zot-results-table">
            {searchResults && (
              <ResultsTable data={searchResults} uuid={uuid} reset={reset} />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Zotero
