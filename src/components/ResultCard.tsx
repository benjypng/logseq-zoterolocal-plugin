import { CreatorItem, ZotData } from '../interfaces'

interface ResultCardProps {
  item: Partial<ZotData>
}

const Creators = ({ creator }: { creator: CreatorItem }) => {
  return (
    <span style={{ marginRight: '5px' }}>
      {creator.firstName} {creator.lastName} ({creator.creatorType})
    </span>
  )
}

export const ResultCard = ({ item }: ResultCardProps) => {
  const { title, creators, itemType, date } = item

  return (
    <div className="zot-result-card">
      <div className="result-details">
        <div className="left">
          <div className="title">
            {title} <span className="tag">{itemType}</span>
          </div>
          <div className="creators">
            {creators &&
              creators.map((creator, index) => (
                <Creators key={index} creator={creator} />
              ))}
          </div>
        </div>
        <div className="right">
          <div>{date}</div>
          <div>{item.inGraph ? 'IN GRAPH' : 'NOT IN GRAPH'}</div>
        </div>
      </div>
    </div>
  )
}
