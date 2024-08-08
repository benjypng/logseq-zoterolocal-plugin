import Fuse from 'fuse.js'

import { ZotData } from '../features/main/interfaces'

export const fuseHook = (data: any, options: any, query: string) => {
  const fuse = new Fuse<ZotData>(data, options)
  return fuse.search(query)
}
