import Fuse from 'fuse.js'

import { FUSE_KEYS, FUSE_THRESHOLD } from '../constants'
import { ZotData } from '../features/main/interfaces'

export const useFuse = (data: ZotData[], searchStr: string) => {
  const fuse = new Fuse<ZotData>(data, {
    keys: FUSE_KEYS,
    threshold: FUSE_THRESHOLD,
  })
  return fuse.search(searchStr)
}
