import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import { Zotero } from './features/main'
import { GlossaryObj, ZotData } from './features/main/interfaces'
import { handlePopup } from './handle-popup'
import { getZotItems, testZotConnection } from './services/get-zot-items'
import { mapItems } from './services/map-items'
import { handleSettings } from './settings'

const main = async () => {
  console.log('logseq-zoterolocal-plugin loaded')
  // Used to handle any popups
  handlePopup()

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  // Get initial items
  const response = await testZotConnection()
  handleSettings(response.message, response.code)

  logseq.provideModel({
    async managePowerTags() {
      const response = await getZotItems()
      if (!response) return

      const items = await mapItems(response)
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
  logseq.Editor.registerSlashCommand('Insert Zotero glossary', async (e) => {
    const glossaryObj: GlossaryObj = {
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

    //    await logseq.Editor.updateBlock(
    //      e.uuid,
    //      `Zotero Template
    //template:: Zotero Template
    //template-including-parent:: false`,
    //    )

    let glossaryStr = logseq.settings!.useCiteKeyForTitle
      ? glossaryObj.citeKey
      : glossaryObj.title

    Object.entries(glossaryObj).map(
      ([key, value]) =>
        (glossaryStr += `
${key}:: ${value}`),
    )

    const templatRootBlk = await logseq.Editor.insertBlock(
      e.uuid,
      glossaryStr,
      {
        before: false,
        sibling: false,
      },
    )
  })
}

logseq.ready(main).catch(console.error)
