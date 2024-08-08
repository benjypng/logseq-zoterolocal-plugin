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
      default: '',
      title: 'Connection Test',
      description: message,
    },
  ]

  logseq.useSettingsSchema(settings)
}
