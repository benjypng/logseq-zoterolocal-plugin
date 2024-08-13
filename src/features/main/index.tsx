import './index.css'

import Fuse from 'fuse.js'
import { ShieldAlert, SquareX } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ResultsTable } from '../../components/ResultsTable'
import { FUSE_KEYS, FUSE_THRESHOLD } from '../../constants'
import { useZotItems } from '../../hooks/use-items'
import { mapItems } from '../../services/map-items'
import { ZotData } from './interfaces'

interface ZoteroProps {
  uuid: string
}

const Zotero = ({ uuid }: ZoteroProps) => {
  const { data, isLoading, error } = useZotItems()
  const [items, setItems] = useState<ZotData[]>([])
  const [searchResults, setSearchResults] = useState<ZotData[]>([])
  const { register, watch } = useForm()

  useEffect(() => {
    if (data) {
      const updateLocalItems = async () => {
        const items = await mapItems(data)
        setItems(items)
        setSearchResults(items)
      }
      updateLocalItems()
    }
  }, [data])

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: FUSE_KEYS,
      threshold: FUSE_THRESHOLD,
      includeScore: true,
    })
  }, [items])

  const searchInput = watch('search')

  useEffect(() => {
    if (!searchInput) {
      setSearchResults(items)
      return
    }
    const results = fuse.search(searchInput)
    setSearchResults(results.map((result) => result.item))
  }, [searchInput, fuse, items])

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
      {!isLoading && !error && (
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
            {searchResults && <ResultsTable data={searchResults} uuid={uuid} />}
          </div>
        </>
      )}
    </div>
  )
}

export default Zotero
