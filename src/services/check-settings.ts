export const isValidSettings = () => {
  if (
    !['<% citeKey %>', '<% title %>', '<% shortTitle %>'].includes(
      logseq.settings!.pagenameTemplate as string,
    )
  ) {
    logseq.UI.showMsg(
      'Illegal page name template. Please check plugin settings',
      'error',
    )
    return null
  }

  if (
    !['<% firstName %>', '<% lastName %>', '<% creatorType %>'].includes(
      logseq.settings!.authorTemplate as string,
    )
  ) {
    logseq.UI.showMsg(
      'Illegal author template. Please check plugin settings',
      'error',
    )
    return null
  }
}
