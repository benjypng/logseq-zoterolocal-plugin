import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import { Zotero } from './features/main'
import { handlePopup } from './handle-popup'
import { getZotItems } from './services/get-zot-items'
import { mapAttachmentToParent } from './services/map-attachment-to-parent'
import { handleSettings } from './settings'

export const URL = 'http://127.0.0.1:23119/api/users/0/items'

const main = async () => {
  console.log('logseq-zoterolocal-plugin loaded')
  // Used to handle any popups
  handlePopup()

  // Get initial items
  const response = await getZotItems()

  handleSettings(response.message, response.code)

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  logseq.provideModel({
    async managePowerTags() {
      const response = await getZotItems()
      if (!response.code) {
        logseq.UI.showMsg(response.message, 'error')
        return
      }
      const items = mapAttachmentToParent(response.data)
      if (!items[0]) return

      root.render(<Zotero items={items} />)
      logseq.showMainUI()
    },
  })
  logseq.App.registerUIItem('toolbar', {
    key: 'logseq-zoterolocal-plugin',
    template: `<a data-on-click="managePowerTags" class="button"><i class="ti ti-zzz"></i></a>`,
  })
}

logseq.ready(main).catch(console.error)
