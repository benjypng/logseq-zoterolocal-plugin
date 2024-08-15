import './base.css'
import './index.css'

import { ShieldAlert, SquareX } from 'lucide-react'
import { useCallback, useState } from 'react'

import { ItemsTable } from '../../components/ItemsTable'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { useZotItems } from '../../hooks/use-items'

const Zotero = () => {
  const { data: zotItems, isSuccess, error, isFetching } = useZotItems()
  const [resultsShown, setResultsShown] = useState(false)

  const handleClose = useCallback(() => {
    logseq.hideMainUI()
  }, [zotItems])

  return (
    <div id="zot-container">
      <div id="zot-header-container">
        <h1>logseq-zoterolocal-plugin</h1>
        <SquareX onClick={handleClose} id="zot-close-button" />
      </div>
      <button
        onClick={() => {
          if (resultsShown) {
            setResultsShown(false)
          } else {
            setResultsShown(true)
          }
        }}
      >
        Show All Items
      </button>
      {resultsShown && (
        <>
          {isFetching && (
            <div className="zot-loading-error">
              <LoadingSpinner size="2rem" color="teal" /> Fetching data from
              Zotero 7... <br />
              It may take up to 5 seconds for larger libraries.
            </div>
          )}
          {error && (
            <div className="zot-loading-error">
              <ShieldAlert size="2rem" color="teal" /> Error loading items:{' '}
              {error.message}
            </div>
          )}
          {isSuccess && (
            <>
              <div id="zot-results-table">
                {zotItems && <ItemsTable data={zotItems} />}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Zotero
