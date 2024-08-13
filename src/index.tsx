import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import { GlossaryObj } from './features/main/interfaces'
import { handlePopup } from './handle-popup'
import { isValidSettings } from './services/check-settings'
import { createTemplateGlossary } from './services/create-template-glossary'
import { testZotConnection } from './services/get-zot-items'
import { handleSettings } from './settings'
import ZotContainer from './ZotContainer'

const main = async () => {
  console.log('logseq-zoterolocal-plugin loaded')

  // Used to handle any popups
  handlePopup()

  // Get initial items
  const response = await testZotConnection()
  handleSettings(response.message, response.code)

  const validSettings = isValidSettings()
  if (!validSettings) return

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  logseq.Editor.registerSlashCommand('Launch Zotero plugin', async (e) => {
    root.render(<ZotContainer uuid={e.uuid} />)
    logseq.showMainUI()
  })

  // Insert glossary as blocks for user to choose
  logseq.Editor.registerSlashCommand('Insert Zotero template', async (e) => {
    const glossaryObj: Partial<GlossaryObj> = {
      // <% notes %> is not inside because they should belong in the blocks, not properties
      accessDate: '<% accessDate %>',
      attachments: '<% attachments %>',
      citeKey: '<% citeKey %>',
      collections: '<% collections %>',
      authors: '<% creators %>',
      date: '<% date %>',
      dateAdded: '<% dateAdded %>',
      dateModified: '<% dateModified %>',
      DOI: '<% DOI %>',
      ISBN: '<% ISBN %>',
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
