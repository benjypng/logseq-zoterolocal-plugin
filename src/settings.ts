import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

export const settings: SettingSchemaDesc[] = [
  {
    key: 'sampleSetting',
    type: 'string',
    default: 'This is a sample setting',
    title: 'Sample Setting',
    description: 'Modify settings.ts accordingly.',
  },
]
