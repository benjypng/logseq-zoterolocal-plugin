import { CollectionItem } from '../interfaces'

export const getCollectionNames = (
  keys: string[],
  collections: CollectionItem[],
): string[] => {
  const collectionArr: string[] = []
  for (const key of keys) {
    for (const collection of collections) {
      if (key === collection.key) {
        collectionArr.push(`[[${collection.name}]]`)
      }
    }
  }
  return collectionArr
}
