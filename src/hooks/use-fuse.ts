import Fuse from 'fuse.js'

import { FUSE_KEYS, FUSE_THRESHOLD } from '../constants'
import { ZotItem } from '../interfaces'

export const useFuse = (data: ZotItem[], searchStr: string) => {
  const fuse = new Fuse<ZotItem>(data, {
    keys: FUSE_KEYS,
    threshold: FUSE_THRESHOLD,
  })
  return fuse.search(searchStr)
}
