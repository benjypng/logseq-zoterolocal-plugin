export const isValidSettings = () => {
  if (
    !['<% citeKey %>', '<% title %>', '<% shortTitle %>'].some((placeholder) =>
      (logseq.settings!.pagenameTemplate as string).includes(placeholder),
    )
  ) {
    logseq.UI.showMsg(
      'Illegal page name template. Please check plugin settings',
      'error',
    )
    return null
  }

  if (
    !['<% firstName %>', '<% lastName %>', '<% creatorType %>'].some(
      (placeholder) =>
        (logseq.settings!.authorTemplate as string).includes(placeholder),
    )
  ) {
    logseq.UI.showMsg(
      'Illegal author template. Please check plugin settings',
      'error',
    )
    return null
  }

  return true
}
