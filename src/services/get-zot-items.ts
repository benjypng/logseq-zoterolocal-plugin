import axios from 'axios'

import { URL } from '..'

export const getZotItems = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: URL,
      headers: {
        'Content-Type': 'text/plain',
        'x-zotero-connector-api-version': '3.0',
        'zotero-allowed-request': 'true',
      },
    })
    return {
      data: response.data,
      message: '✅ Connection to Zotero is working',
      code: response.status,
    }
  } catch (error) {
    return {
      data: error,
      message:
        '❌ Unable to retrieve items from Zotero. Please ensure that you are using Zotero 7 (and above), and that the app is running.',
    }
  }
}
