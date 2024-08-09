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
      key: 'useCiteKeyForTitle',
      type: 'boolean',
      title: 'Use Citation Key for Title',
      description: `Use the item's citation key as it's title`,
      default: true,
    },
    {
      key: 'zotTemplate',
      type: 'string',
      title: 'Template Name',
      description:
        'The template name that holds your template for a Zotero page. Ensure that include parent is set to false. ',
      default: '',
    },
  ]

  logseq.useSettingsSchema(settings)
}
