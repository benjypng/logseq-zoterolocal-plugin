import { CollectionItem, ZotCollection } from '../features/main/interfaces'
import { getZotCollections } from './get-zot-items'

export const getCollectionName = async (
  keys: string[],
): Promise<CollectionItem[]> => {
  const collections = await getZotCollections()
  if (!collections) return []

  const mappedCollections = collections.map((collection: ZotCollection) => ({
    key: collection.key,
    name: collection.data.name,
  }))

  const collectionArr: CollectionItem[] = []
  for (const key of keys) {
    for (const collection of mappedCollections) {
      if (key === collection.key) {
        collectionArr.push({
          key,
          name: collection.name,
        })
      }
    }
  }
  return collectionArr
}
