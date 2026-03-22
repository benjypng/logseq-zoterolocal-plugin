import '@logseq/libs'

import { BlockCursorPosition } from '@logseq/libs/dist/LSPlugin'
import { createRoot } from 'react-dom/client'

import { ZotContainer } from './components'
import { handlePopup } from './handle-popup'
import { GlossaryObj } from './interfaces'
import { createTemplateGlossary } from './services/create-template-glossary'
import { testZotConnection } from './services/get-zot-items'
import { registerAdminCommands } from './services/register-admin-commands'
import { syncAnnotations } from './services/sync-annotations'
import { handleSettings } from './settings'

const main = async () => {
  await logseq.UI.showMsg(
    `logseq-zoterolocal-plugin loaded. Please proceed to settings to continue setup.`,
    'warning',
  )

  registerAdminCommands()
  handlePopup()

  const response = await testZotConnection()
  handleSettings({ msg: response.msg })

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  logseq.App.registerPageMenuItem(
    'Zotero: Sync annotations',
    async ({ page }) => {
      try {
        await syncAnnotations(page)
      } catch (error) {
        await logseq.UI.showMsg(
          `Failed to sync annotations: ${(error as Error).message}`,
          'error',
        )
      }
    },
  )

  ///////////////////////////////////
  // INSERT FULL DOCUMENT IN GRAPH //
  ///////////////////////////////////
  logseq.Editor.registerSlashCommand('Zotero: Insert full item', async (e) => {
    const { rect } =
      (await logseq.Editor.getEditingCursorPosition()) as BlockCursorPosition
    root.render(<ZotContainer flag={'full'} uuid={e.uuid} rect={rect} />)
    logseq.showMainUI()

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        const searchField: HTMLInputElement =
          document.querySelector('#search-field')!
        searchField.focus()
      }
    })
  })

  //////////////////////////////
  // INSERT CITATION IN GRAPH //
  //////////////////////////////
  logseq.Editor.registerSlashCommand(
    'Zotero: Cite (insert citation)',
    async (e) => {
      const { rect } =
        (await logseq.Editor.getEditingCursorPosition()) as BlockCursorPosition
      root.render(<ZotContainer flag={'citation'} uuid={e.uuid} rect={rect} />)
      logseq.showMainUI()

      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key !== 'Escape') {
          const searchField: HTMLInputElement =
            document.querySelector('#search-field')!
          searchField.focus()
        }
      })
    },
  )

  //////////////////////////////////////////
  // DEPRECATED: REGISTER ICON TO TOOLBAR //
  //////////////////////////////////////////
  //logseq.provideModel({
  //  async viewZotItems() {
  //    root.render(<ZotContainer flag={'table'} />)
  //    logseq.showMainUI()
  //  },
  //})
  //logseq.App.registerUIItem('toolbar', {
  //  key: 'logseq-zoterolocal-plugin',
  //  template: `<a data-on-click="viewZotItems" class="button"><i class="ti ti-news"></i></a>`,
  //})

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
      libraryLink: '<% libraryLink %>',
      pages: '<% pages %>',
      parentItem: '<% parentItem %>',
      publicationTitle: '<% publicationTitle %>',
      relations: '<% relations %>',
      shortTitle: '<% shortTitle %>',
      tags: '<% tags %>',
      itemTitle: '<% title %>',
      url: '<% url %>',
      version: '<% version %>',
      volume: '<% volume %>',
    }

    await logseq.Editor.updateBlock(e.uuid, `Zotero Template`)

    // Add template props
    await logseq.Editor.upsertBlockProperty(
      e.uuid,
      'template',
      'Zotero Template',
    )
    await logseq.Editor.upsertBlockProperty(
      e.uuid,
      'template-including-parent',
      false,
    )

    await createTemplateGlossary(glossaryObj, e.uuid)
  })
}

logseq.ready(main).catch(console.error)
