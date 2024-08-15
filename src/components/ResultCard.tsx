import { UseFormReset } from 'react-hook-form'

import { FormValues } from '../features/search-item'
import { CreatorItem, ZotData } from '../interfaces'

interface ResultCardProps {
  flag: 'full' | 'table' | 'citation'
  uuid: string
  item: ZotData
  reset: UseFormReset<FormValues>
}

const Creators = ({ creator }: { creator: CreatorItem }) => {
  return (
    <span style={{ marginRight: '5px' }}>
      {creator.firstName} {creator.lastName} ({creator.creatorType})
    </span>
  )
}

export const ResultCard = ({ flag, uuid, item, reset }: ResultCardProps) => {
  const { title, creators, itemType, citeKey, date } = item

  const handleClick = () => {
    if (flag === 'citation') insertCitation()
    if (flag === 'full') insertZot()
  }

  const insertCitation = async () => {
    if (!citeKey) logseq.UI.showMsg('No citation key found', 'error')
    const templateStr = (logseq.settings!.citekeyTemplate as string).replace(
      `<% citeKey %>`,
      citeKey,
    )
    await logseq.Editor.updateBlock(uuid, templateStr)
    reset()
    logseq.hideMainUI()
  }

  const insertZot = () => {
    console.log(item)
    console.log('UUID', uuid)
    console.log('Insert full Zotero Item')
  }

  return (
    <div className="zot-result-card" onClick={handleClick}>
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
