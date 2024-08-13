import './index.css'

import { ShieldAlert, SquareX } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ResultsTable } from '../../components/ResultsTable'
import { FUSE_KEYS, FUSE_THRESHOLD } from '../../constants'
import { useZotItems } from '../../hooks/use-items'
import { fuseHook } from '../../services/fuse-hook'
import { mapItems } from '../../services/map-items'
import { ZotData } from './interfaces'

interface ZoteroProps {
  uuid: string
}

const Zotero = ({ uuid }: ZoteroProps) => {
  const { data, isLoading, error } = useZotItems()
  const [localItems, setLocalItems] = useState<ZotData[]>()
  const { register, watch } = useForm()

  useEffect(() => {
    if (data) {
      const updateLocalItems = async () => {
        const items = await mapItems(data)
        setLocalItems(items)
      }
      updateLocalItems()
    }
  }, [data])

  const fuseOptions = {
    keys: FUSE_KEYS,
    threshold: FUSE_THRESHOLD,
    includeScore: true,
  }
  const searchInput = watch('search')
  useEffect(() => {
    if (!searchInput) return
    const results = fuseHook(data, fuseOptions, searchInput)
    setLocalItems(results.map((result) => result.item))
  }, [searchInput])

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
            {localItems && <p>Results: {localItems.length}</p>}
          </div>

          <div id="zot-results-table">
            {localItems && <ResultsTable data={localItems} uuid={uuid} />}
          </div>
        </>
      )}
    </div>
  )
}

export default Zotero
