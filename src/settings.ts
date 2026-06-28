import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

import { ZOT_DATA_KEY_MAP } from './constants'
import { PropertyPreset } from './interfaces'

export const PRESET_CHOICES: PropertyPreset[] = [
  'Minimal',
  'Core',
  'Academic Extended',
  'Full',
  'Custom',
]

export const handleSettings = ({ msg }: { msg: string }) => {
  const propsArray = Object.keys(ZOT_DATA_KEY_MAP)
  const filteredPropsArray = propsArray.filter(
    (prop) =>
      // To be included in the page itself
      prop !== 'abstractNote' &&
      prop !== 'attachments' &&
      prop !== 'notes' &&
      // Not necessary
      prop !== 'inGraph',
  )

  const settings: SettingSchemaDesc[] = [
    {
      key: 'testConnection',
      type: 'heading',
      title: 'Connection Test',
      description: msg,
      default: '',
    },
    {
      key: 'zotUrl',
      type: 'string',
      title: 'Zotero API URL',
      description:
        'The base URL of your local Zotero API. Change this only if Zotero runs on a non-default port or host.',
      default: 'http://127.0.0.1:23119/api/users/0',
    },
    {
      key: 'propertyPreset',
      type: 'enum',
      title: 'Property Preset (DB version)',
      description:
        'Choose a preset to control which properties are added to Zotero pages. "Minimal" includes just the essentials (title, date, author, DOI/ISBN, item type, Zotero link). "Core" adds common citation fields. "Academic Extended" adds dates, institutional, and manuscript fields. "Full" includes everything. "Custom" lets you pick individual properties below.',
      default: 'Core',
      enumPicker: 'select',
      enumChoices: PRESET_CHOICES,
    },
    {
      key: 'pageProps',
      type: 'enum',
      title: 'Custom Page Properties (DB version)',
      description: `Only used when Property Preset is set to "Custom". Select the properties to include for each Zotero item. After changing, invoke the command palette and use 'Add Zotero schema to Logseq'.`,
      default: filteredPropsArray,
      enumPicker: 'checkbox',
      enumChoices: filteredPropsArray,
    },
    {
      key: 'attachmentImportMode',
      type: 'enum',
      title: 'Attachment Import Mode (DB version)',
      description:
        'Choose how attachments are added to each Zotero page. "Asset" imports each attachment as a Logseq asset block that opens within Logseq. "Markdown link" leaves it as a plain markdown link that opens in your default system app.',
      default: 'Markdown link',
      enumPicker: 'select',
      enumChoices: ['Asset', 'Markdown link'],
    },
    {
      key: 'openAttachmentInline',
      type: 'boolean',
      title: 'Open Attachment in Logseq (DB version)',
      description:
        'Only applies when Attachment Import Mode is "Markdown link". If enabled, attachments are embedded inline so they open within Logseq. If disabled, they are a plain link that opens in the default system app.',
      default: true,
    },
    {
      key: 'pagenameTemplate',
      type: 'string',
      title: 'Page Name Template',
      description: `Specify the page name for each Zotero import. Available placeholders: <% citeKey %>, <% title %>`,
      default: `R: <% citeKey %>`,
    },
    {
      key: 'citekeyTemplate',
      type: 'string',
      title: 'Template for Cite Key',
      description: `Specify the template when using the command /Zotero: Insert citation. Ensure that <% citeKey %> placeholder is indicated in your template`,
      default: '[@<% citeKey %>]',
    },
    {
      key: 'zotTag',
      type: 'string',
      title: 'Zotero Tag Name',
      description: `Specify the tag name used for Zotero imports`,
      default: 'Zotero',
    },
    {
      key: 'zotTemplate',
      type: 'string',
      title: 'Template Name (MD version)',
      description:
        'The template name that holds your template for a Zotero page. Ensure that include parent is set to false. ',
      default: 'Zotero Template',
    },
    {
      key: 'authorTemplate',
      type: 'string',
      title: 'Author Template (MD version)',
      description:
        'Specify how authors should be shown in the properties. Available placeholders: <% firstName %>, <% lastName %>, <% creatorType %>',
      default: '<% firstName %> <% lastName %> (<% creatorType %>)',
    },
  ]

  logseq.useSettingsSchema(settings)
}
