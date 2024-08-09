import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import { Zotero } from './features/main'
import { handlePopup } from './handle-popup'
import { getZotItems } from './services/get-zot-items'
import { mapItems } from './services/map-items'
import { handleSettings } from './settings'
import { ZotData } from './features/main/interfaces'

const main = async () => {
  console.log('logseq-zoterolocal-plugin loaded')
  // Used to handle any popups
  handlePopup()

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  // Get initial items
  const response = await getZotItems()
  handleSettings(response.message, response.code)

  logseq.provideModel({
    async managePowerTags() {
      const response = await getZotItems()
      if (!response.code) {
        logseq.UI.showMsg(response.message, 'error')
        return
      }
      const items = await mapItems(response.data)
      if (!items[0]) return

      root.render(<Zotero items={items} />)
      logseq.showMainUI()
    },
  })
  logseq.App.registerUIItem('toolbar', {
    key: 'logseq-zoterolocal-plugin',
    template: `<a data-on-click="managePowerTags" class="button"><i class="ti ti-zzz"></i></a>`,
  })

  // Insert glossary as blocks for user to choose
  logseq.Editor.registerSlashCommand('Insert Zotero glossary', (e) => {
    const glossaryObj = {
      accessDate: '<% accessDate %>',
      attachment: '<% attachment %>',
      citeKey: '<% citeKey %>',
      collections: '<% collections %>',
      authors: '<% firstName %> <% lastName %> (<% creatorType %>)',
      date: '<% date %>',
      dateAdded: '<% dateAdded %>',
      dateModified: '<% dateModified %>',
      DOI: '<% DOI %>',
      inGraph: '<% inGraph %>',
      ISSN: '<% ISSN %>',
      issue: '<% issue %>',
      itemType: '<% itemType %>',
      journalAbbreviation: '<% journalAbbreviation %>',
      key: '<% key %>',
      language: '<% language %>',
      libraryCatalog: '<% libraryCatalog %>',
      pages: '<% pages %>',
      parentItem: '<% parentItem %>',
      publicationTitle: '<% publicationTitle %>',
      relations: '<% relations %>',
      shortTitle: '<% shortTitle %>',
      tags: '<% tags %>',
      title: '<% title %>',
      url: '<% url %>',
      version: '<% version %>',
      volume: '<% volume %>',
    }
  })
}

logseq.ready(main).catch(console.error)
