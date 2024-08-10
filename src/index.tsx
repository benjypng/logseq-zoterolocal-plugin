import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import { Zotero } from './features/main'
import { GlossaryObj } from './features/main/interfaces'
import { handlePopup } from './handle-popup'
import { isValidSettings } from './services/check-settings'
import { createTemplateGlossary } from './services/create-template-glossary'
import { getZotItems, testZotConnection } from './services/get-zot-items'
import { mapItems } from './services/map-items'
import { handleSettings } from './settings'

const main = async () => {
  console.log('logseq-zoterolocal-plugin loaded')
  // Used to handle any popups
  handlePopup()

  const validSettings = isValidSettings()
  if (!validSettings) return

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  // Get initial items
  const response = await testZotConnection()
  handleSettings(response.message, response.code)

  logseq.Editor.registerSlashCommand('Launch Zotero plugin', async (e) => {
    const response = await getZotItems()
    if (!response) return

    const items = await mapItems(response)
    if (!items[0]) return

    root.render(<Zotero items={items} uuid={e.uuid} />)
    logseq.showMainUI()
  })

  // Insert glossary as blocks for user to choose
  logseq.Editor.registerSlashCommand('Insert Zotero template', async (e) => {
    const glossaryObj: GlossaryObj = {
      accessDate: '<% accessDate %>',
      attachment: '<% attachment %>',
      citeKey: '<% citeKey %>',
      collections: '<% collections %>',
      authors: '<% creators %>',
      date: '<% date %>',
      dateAdded: '<% dateAdded %>',
      dateModified: '<% dateModified %>',
      DOI: '<% DOI %>',
      inGraph: '<% inGraph %>',
      ISBN: '<% inGraph %>',
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

    await logseq.Editor.updateBlock(
      e.uuid,
      `Zotero Template
    template:: Zotero Template
    template-including-parent:: false`,
    )

    await createTemplateGlossary(glossaryObj, e.uuid)
  })
}

logseq.ready(main).catch(console.error)
