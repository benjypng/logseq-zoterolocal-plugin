import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

export const handleSettings = async (
  message: string,
  code: number | undefined,
) => {
  if (!code) logseq.UI.showMsg(message, 'error')

  const settings: SettingSchemaDesc[] = [
    {
      key: 'testConnection',
      type: 'heading',
      title: 'Connection Test',
      description: message,
      default: '',
    },
    {
      key: 'zotTemplate',
      type: 'string',
      title: 'Template Name',
      description:
        'The template name that holds your template for a Zotero page. Ensure that include parent is set to false. ',
      default: 'Zotero Template',
    },
    {
      key: 'pagenameTemplate',
      type: 'string',
      title: 'Page Name Template',
      description: `Specify the page name for each Zotero import. Available placeholders: <% citeKey %>, <% title %>`,
      default: `R: <% citeKey %>`,
    },
    {
      key: 'authorTemplate',
      type: 'string',
      title: 'Author Template',
      description:
        'Specify how authors should be shown in the properties. Available placeholders: <% firstName %>, <% lastName %>, <% creatorType %>',
      default: '<% firstName %> <% lastName %> (<% creatorType %>)',
    },
    {
      key: 'citekeyTemplate',
      type: 'string',
      title: 'Template for Cite Key',
      description: `Specify the template when using the command /Zotero: Insert citation. Ensure that <% citeKey %> placeholder is indicated in your template`,
      default: '[@<% citeKey %>]',
    },
  ]

  logseq.useSettingsSchema(settings)
}
