import './index.css'

import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { ResultsTable } from '../../components/ResultsTable'
import { FUSE_KEYS } from '../../constants'
import { fuseHook } from '../../services/fuse-hook'
import { ZotData } from './interfaces'
import { SquareX } from 'lucide-react'

interface ZoteroProps {
  items: ZotData[]
  uuid: string
}

export const Zotero = ({ items, uuid }: ZoteroProps) => {
  const [localItems, setLocalItems] = useState<ZotData[]>()
  const { register, watch } = useForm()

  useEffect(() => {
    setLocalItems(items)
  }, [items])

  const fuseOptions = {
    keys: FUSE_KEYS,
    threshold: 0.6,
    includeScore: true,
  }

  const searchInput = watch('search')
  useEffect(() => {
    if (!searchInput) return

    const results = fuseHook(items, fuseOptions, searchInput)
    setLocalItems(results.map((result) => result.item))
  }, [searchInput])

  const handleClose = useCallback(() => {
    logseq.hideMainUI()
  }, [items])

  return (
    <div id="zot-container">
      <div id="zot-header-container">
        <h1>logseq-zoterolocal-plugin</h1>
        <SquareX onClick={handleClose} id="zot-close-button" />
      </div>
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
    </div>
  )
}
