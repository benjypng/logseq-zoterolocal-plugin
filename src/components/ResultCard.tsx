import { CreatorItem, ZotData } from '../interfaces'

interface ResultCardProps {
  item: Partial<ZotData>
}

const Creators = ({ creator }: { creator: CreatorItem }) => {
  return (
    <div style={{ marginRight: '5px' }}>
      {creator.firstName} {creator.lastName} ({creator.creatorType})
    </div>
  )
}

export const ResultCard = ({ item }: ResultCardProps) => {
  const { title, creators, itemType, date } = item
  console.log(creators)

  return (
    <div className="zot-result-card">
      <div>
        {title}{' '}
        <div style={{ display: 'flex' }}>
          {creators &&
            creators.map((creator) => <Creators creator={creator} />)}
        </div>
        <div>{item.inGraph ? 'IN GRAPH' : 'NOT IN GRAPH'}</div>
      </div>
      <div style={{ justifyContent: 'end' }}>
        {itemType}
        <div>{date}</div>
      </div>
    </div>
  )
}
