import '@benjypng/ls-plugin-design-system/styles.css'

import { SearchItem } from '.'

export const ZotContainer = ({
  flag,
  uuid,
  rect,
}: {
  flag: 'full' | 'table' | 'citation'
  uuid?: string
  rect?: { x: number; y: number }
}) => {
  return (
    <div style={{ background: 'none' }}>
      {(flag === 'full' || flag === 'citation') && rect && uuid && (
        <SearchItem flag={flag} rect={rect} uuid={uuid} />
      )}
    </div>
  )
}
