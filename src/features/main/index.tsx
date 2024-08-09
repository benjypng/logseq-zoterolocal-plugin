import './index.css'

import { IconX } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { ResultsTable } from '../../components/ResultsTable'
import { KEYS } from '../../constants'
import { fuseHook } from '../../services/fuse-hook'
import { ZotData } from './interfaces'

interface ZoteroProps {
  items: ZotData[]
}

export const Zotero = ({ items }: ZoteroProps) => {
  const [localItems, setLocalItems] = useState(items)
  const { register, watch } = useForm()

  const fuseOptions = {
    keys: KEYS,
    threshold: 0.6,
    includeScore: true,
  }

  const searchInput = watch('search')
  useEffect(() => {
    if (!searchInput) return

    const results = fuseHook(items, fuseOptions, searchInput)
    console.log(results)
    setLocalItems(results.map((result) => result.item))
  }, [searchInput])

  const handleClose = useCallback(() => {
    logseq.hideMainUI()
  }, [items])

  return (
    <div id="zot-container">
      <div id="zot-header-container">
        <h1>logseq-zoterolocal-plugin</h1>
        <IconX onClick={handleClose} id="zot-close-button" />
      </div>
      <input
        autoFocus
        {...register('search')}
        type="text"
        placeholder="Start searching"
      />

      <div id="zot-results-table">
        <ResultsTable data={localItems} />
      </div>
    </div>
  )
}
