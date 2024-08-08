import './index.css'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { fuseHook } from '../../services/fuse-hook'
import { ZotData } from './interfaces'

interface ZoteroProps {
  items: ZotData[]
}

export const Zotero = ({ items }: ZoteroProps) => {
  const [localItems, setLocalItems] = useState(items)
  const { register, watch } = useForm()

  const fuseOptions = {
    keys: Object.keys(items[0]!),
    threshold: 0.6,
    includeScore: true,
  }

  const searchInput = watch('search')

  useEffect(() => {
    if (!searchInput) return

    const results = fuseHook(items, fuseOptions, searchInput)
    setLocalItems(results.map((result) => result.item))
  }, [searchInput])

  return (
    <div id="zoterolocal-container">
      <h1>logseq-zoterolocal-plugin</h1>

      <input autoFocus {...register('search')} type="text" />

      <div id="section-list-items">
        {localItems.map((result, index) => {
          return <div key={index}>{result.title}</div>
        })}
      </div>
    </div>
  )
}